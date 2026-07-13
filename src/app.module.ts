import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { ApiModule } from '@/api/api.module'
import { cloudinaryEnv } from '@/config/env/cloudinary.env'
import { InfraModule } from '@/infra/infra.module'
import { LibsModule } from '@/libs/libs.module'
import { IS_DEV_ENV } from '@/shared/utils'

import { BotModule } from './bots/bot.module'
import { appEnv, fingerprintEnv, hostsEnv, mailerEnv, monobankEnv, queueEnv, redisEnv, sentinelEnv, telegramEnv, turnstileEnv, webauthnEnv } from './config'

@Module({
	imports: [
		ConfigModule.forRoot({
			ignoreEnvFile: !IS_DEV_ENV,
			isGlobal: true,
			load: [appEnv, fingerprintEnv, hostsEnv, mailerEnv, queueEnv, redisEnv, sentinelEnv, cloudinaryEnv, telegramEnv, turnstileEnv, webauthnEnv, monobankEnv]
		}),

		ApiModule,
		InfraModule,
		LibsModule,
		BotModule
	]
})
export class AppModule {}
