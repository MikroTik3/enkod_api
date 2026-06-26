import { applyDecorators, UseGuards } from '@nestjs/common'

import { SessionAuthGuard, SubscriptionGuard } from '../guards'

export function SubscriptionOnly() {
	return applyDecorators(UseGuards(SessionAuthGuard, SubscriptionGuard))
}
