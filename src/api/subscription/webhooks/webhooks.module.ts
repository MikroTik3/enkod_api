import { Module } from '@nestjs/common'

import { ManagerBotModule } from '@/bots/manager/manager.bot.module'
import { ManagerBotService } from '@/bots/manager/manager.bot.service'

import { WebhooksController } from './webhooks.controller'
import { WebhooksService } from './webhooks.service'
import { WebhooksValidator } from './webhooks.validator'

@Module({
	imports: [ManagerBotModule],
	controllers: [WebhooksController],
	providers: [WebhooksService, WebhooksValidator, ManagerBotService]
})
export class WebhooksModule {}
