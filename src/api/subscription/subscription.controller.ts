import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiHeader, ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { User } from '@prisma/generated'

import { Authorization, Authorized } from '@/shared/decorators'

import { InitSubscriptionResponse } from './dto'
import { SubscriptionService } from './subscription.service'

@Controller('subscription')
export class SubscriptionController {
	public constructor(private readonly subscription: SubscriptionService) {}

	@ApiOperation({
		summary: 'Init Subscription',
		description: 'Creates a new subscription and returns a URL to complete the payment process.'
	})
	@ApiOkResponse({
		type: InitSubscriptionResponse
	})
	@Authorization()
	@Post('init')
	@HttpCode(HttpStatus.OK)
	public async init(@Authorized() user: User) {
		return await this.subscription.create(user)
	}
}
