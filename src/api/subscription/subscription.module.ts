import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MonobankModule } from 'nestjs-monobank'

import { ManagerBotModule } from '@/bots/manager/manager.bot.module'
import { ManagerBotService } from '@/bots/manager/manager.bot.service'
import { getMonobankConfig } from '@/config'

import { SubscriptionController } from './subscription.controller'
import { SubscriptionService } from './subscription.service'
import { WebhooksModule } from './webhooks/webhooks.module'

@Module({
	imports: [
		MonobankModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getMonobankConfig,
			inject: [ConfigService]
		}),

		WebhooksModule,
		ManagerBotModule
	],
	controllers: [SubscriptionController],
	providers: [SubscriptionService, ManagerBotService]
})
export class SubscriptionModule {}
