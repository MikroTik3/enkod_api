import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEnum, IsInt, IsOptional, IsString, IsUrl, Min } from 'class-validator'

export enum PlanInterval {
	MONTHLY = '1m'
}

export class InitSubscriptionRequest {
	@ApiProperty({ example: 29900, description: 'Сума в копійках (UAH * 100)' })
	@IsInt()
	@Min(1)
	amount: number
}

export class InitSubscriptionResponse {
	@ApiProperty({ example: 'https://pay.mbnk.biz/p2_9ZgpZVsl3' })
	pageUrl: string

	@ApiProperty({ example: '12345678' })
	subscriptionId: string
}
