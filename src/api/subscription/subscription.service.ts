import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SubscriptionInterval, SubscriptionPlan, SubscriptionStatus, type User } from '@prisma/generated'
import { MonobankService } from 'nestjs-monobank'

import { PrismaService } from '@/infra/prisma/prisma.service'

import { InitSubscriptionRequest, InitSubscriptionResponse } from './dto'

@Injectable()
export class SubscriptionService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly monobankService: MonobankService,
		private readonly configService: ConfigService
	) {}

	public async create(dto: InitSubscriptionRequest, user?: User) {
		const { amount } = dto

		const existing = await this.prismaService.subscription.findFirst({
			where: {
				userId: user.id,
				status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.PENDING] }
			}
		})

		if (existing?.status === SubscriptionStatus.ACTIVE || existing?.status === SubscriptionStatus.PENDING) throw new BadRequestException('Subscription already exists')

		const subscription = await this.monobankService.subscriptions.create({
			amount,
			interval: '1m',
			redirectUrl: `${this.configService.get('HOSTS_APP')}/payment/success`,
			webhookUrls: {
				chargeUrl: `${this.configService.get('HTTP_HOST_TEST')}/api/v1/webhooks/monobank/charge`,
				statusUrl: `${this.configService.get('HTTP_HOST_TEST')}/api/v1/webhooks/monobank/status`
			}
		})

		await this.prismaService.subscription.upsert({
			where: { userId: user.id },
			update: {
				subscriptionId: subscription.subscriptionId,
				userId: user.id,
				amount,
				interval: SubscriptionInterval.MONTHLY,
				plan: SubscriptionPlan.PREMIUM,
				status: SubscriptionStatus.PENDING
			},
			create: {
				subscriptionId: subscription.subscriptionId,
				userId: user.id,
				amount,
				interval: SubscriptionInterval.MONTHLY,
				plan: SubscriptionPlan.PREMIUM,
				status: SubscriptionStatus.PENDING
			}
		})

		return {
			subscriptionId: subscription.subscriptionId,
			pageUrl: subscription.pageUrl
		} satisfies InitSubscriptionResponse
	}
}
