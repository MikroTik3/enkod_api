import { type CanActivate, type ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { SubscriptionStatus } from '@prisma/generated'
import { Request } from 'express'

import { PrismaService } from '@/infra/prisma/prisma.service'

@Injectable()
export class SubscriptionGuard implements CanActivate {
	public constructor(private readonly prismaService: PrismaService) {}

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>()
		const user = request.user

		const subscription = await this.prismaService.subscription.findUnique({
			where: {
				userId: user.id
			}
		})

		const now = new Date()

		const valid = subscription?.status === SubscriptionStatus.ACTIVE && (!subscription.endedAt || subscription.endedAt > now)

		if (!valid) throw new ForbiddenException('Subscription subscription required')

		return true
	}
}
