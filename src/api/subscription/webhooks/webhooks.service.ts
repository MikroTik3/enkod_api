import { BadRequestException, Injectable, Logger } from '@nestjs/common'
import { PaymentStatus, type Subscription, SubscriptionStatus } from '@prisma/generated'
import { MonobankService } from 'nestjs-monobank'

import { ManagerBotService } from '@/bots/manager/manager.bot.service'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { MailService } from '@/libs/mail/mail.service'

import { WebhooksValidator } from './webhooks.validator'

@Injectable()
export class WebhooksService {
	private readonly logger = new Logger(WebhooksService.name)

	public constructor(
		private readonly monobankService: MonobankService,
		private readonly mailService: MailService,
		private readonly botService: ManagerBotService,
		private readonly prismaService: PrismaService,
		private readonly validator: WebhooksValidator
	) {}

	public async charge({ rawBody, signature, payload, ip }: { rawBody: string; signature: string; payload: any; ip: string }) {
		await this.validateWebhook(rawBody, signature, ip)

		this.logger.log(`Charge webhook received | subscriptionId: ${payload.subscriptionId}`)

		const subscription = await this.prismaService.subscription.findUnique({
			where: { subscriptionId: payload.subscriptionId }
		})

		if (!subscription) {
			this.logger.warn(`Subscription not found | subscriptionId: ${payload.subscriptionId}`)
			throw new BadRequestException('Subscription not found')
		}

		await this.processPayment(payload, subscription)
	}

	public async status({ rawBody, signature, payload, ip }: { rawBody: string; signature: string; payload: any; ip: string }) {
		await this.validateWebhook(rawBody, signature, ip)

		this.logger.log(`Status webhook received | subscriptionId: ${payload.subscriptionId} | status: ${payload.status}`)

		const statusMap = {
			active: SubscriptionStatus.ACTIVE,
			cancelled: SubscriptionStatus.CANCELLED,
			expired: SubscriptionStatus.EXPIRED
		}

		const subscription = await this.prismaService.subscription.update({
			where: { subscriptionId: payload.subscriptionId },
			data: {
				status: statusMap[payload.status],
				startedAt: payload.status === 'active' ? new Date() : undefined,
				endedAt: ['cancelled', 'expired'].includes(payload.status) ? new Date() : undefined
			}
		})

		await this.prismaService.user.update({
			where: { id: subscription.userId },
			data: {
				isAutoBilling: payload.status === 'active'
			}
		})

		this.logger.log(`Subscription status updated | subscriptionId: ${payload.subscriptionId} → ${payload.status}`)
	}

	public async processPayment(payload: any, subscription: Subscription) {
		if (payload.status === 'processing') {
			this.logger.log(`Skipping processing webhook | invoiceId: ${payload.invoiceId}`)
			return
		}

		this.logger.log(`Processing payment | subscriptionId: ${subscription.subscriptionId} | status: ${payload.status} | amount: ${payload.amount}`)

		await this.prismaService.payment.upsert({
			where: { transactionId: payload.invoiceId },
			update: {
				status: payload.status === 'success' ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
				failureReason: payload.failureReason ?? null,
				raw: payload
			},
			create: {
				subscriptionId: subscription.id,
				userId: subscription.userId,
				status: payload.status === 'success' ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
				amount: payload.amount,
				transactionId: payload.invoiceId,
				failureReason: payload.failureReason ?? null,
				raw: payload
			}
		})

		if (payload.status === 'success') {
			const subscriptionStatus = await this.monobankService.subscriptions.getStatus(payload.subscriptionId)

			await this.prismaService.subscription.update({
				where: { id: subscription.id },
				data: {
					nextChargeAt: subscriptionStatus.nextChargeDate ? new Date(subscriptionStatus.nextChargeDate) : null,

					status: SubscriptionStatus.ACTIVE
				}
			})

			// await this.mailService.sendPaymentSuccess(subscription.userId)
			// await this.botService.notifyPaymentSuccess(subscription.userId)

			this.logger.log(`Payment success | subscriptionId: ${subscription.subscriptionId} | nextChargeAt: ${subscriptionStatus.nextChargeDate}`)
		} else {
			const failedCount = await this.prismaService.payment.count({
				where: { subscriptionId: subscription.id, status: PaymentStatus.FAILED }
			})

			if (failedCount >= 3) {
				await this.prismaService.subscription.update({
					where: { id: subscription.id },
					data: { status: SubscriptionStatus.EXPIRED, endedAt: new Date() }
				})

				await this.prismaService.user.update({
					where: { id: subscription.userId },
					data: { isAutoBilling: false }
				})
			}

			// await this.mailService.sendPaymentSuccess(subscription.userId)
			// await this.botService.notifyPaymentSuccess(subscription.userId)

			this.logger.warn(`Payment failed | subscriptionId: ${subscription.subscriptionId} | reason: ${payload.failureReason}`)
		}
	}

	private async validateWebhook(rawBody: string, signature: string, ip: string) {
		this.validator.validatorMonobank(ip)

		const isValid = await this.monobankService.webhook.verifyWebhookSignature(Buffer.from(rawBody), signature)

		if (!isValid) {
			throw new BadRequestException('Invalid signature')
		}
	}
}
