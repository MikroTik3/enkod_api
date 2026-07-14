import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SubscriptionInterval, SubscriptionPlan, SubscriptionStatus, type User, UserRole } from '@prisma/generated'
import { MonobankService } from 'nestjs-monobank'

import { PrismaService } from '@/infra/prisma/prisma.service'
import { MailService } from '@/libs/mail/mail.service'

import { InitSubscriptionResponse } from './dto'

@Injectable()
export class SubscriptionService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService,
		private readonly monobankService: MonobankService,
		private readonly configService: ConfigService
	) {}

	public async create(user: User) {
		const existing = await this.prismaService.subscription.findUnique({
			where: { userId: user.id }
		})

		if (existing && (existing.status === SubscriptionStatus.ACTIVE || existing.status === SubscriptionStatus.PENDING)) {
			throw new BadRequestException('Subscription already exists')
		}

		if (existing && existing.endedAt && existing.endedAt > new Date()) {
			throw new BadRequestException('У вас вже є активна підписка. Нову можна оформити після закінчення поточного періоду.')
		}

		const subscription = await this.monobankService.subscriptions.create({
			amount: 27500,
			interval: '1m',
			redirectUrl: `${this.configService.get('HOSTS_APP')}/payment/success`,
			webhookUrls: {
				chargeUrl: `${this.configService.get('HTTP_HOST_TEST')}/api/v1/webhooks/monobank/charge`,
				statusUrl: `${this.configService.get('HTTP_HOST_TEST')}/api/v1/webhooks/monobank/status`
			}
		})

		await this.prismaService.subscription.upsert({
			where: { userId: user.id },
			create: {
				userId: user.id,
				subscriptionId: subscription.subscriptionId,
				amount: 27500,
				interval: SubscriptionInterval.MONTHLY,
				plan: SubscriptionPlan.PREMIUM,
				status: SubscriptionStatus.PENDING
			},
			update: {
				subscriptionId: subscription.subscriptionId,
				amount: 27500,
				interval: SubscriptionInterval.MONTHLY,
				plan: SubscriptionPlan.PREMIUM,
				status: SubscriptionStatus.PENDING,
				startedAt: null,
				nextChargeAt: null,
				endedAt: null
			}
		})

		return {
			subscriptionId: subscription.subscriptionId,
			pageUrl: subscription.pageUrl
		} satisfies InitSubscriptionResponse
	}
}
