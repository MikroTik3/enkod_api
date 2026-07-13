import { ApiProperty } from '@nestjs/swagger'
import { IsInt, Min } from 'class-validator'

export enum PlanInterval {
	MONTHLY = '1m'
}

export class InitSubscriptionResponse {
	@ApiProperty({ example: 'https://pay.mbnk.biz/p2_9ZgpZVsl3' })
	pageUrl: string

	@ApiProperty({ example: '12345678' })
	subscriptionId: string
}
