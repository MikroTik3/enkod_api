import { BullModule } from '@nestjs/bullmq'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { getBullmqConfig } from '@/config'

import { CloudinaryModule } from './cloudinary/cloudinary.module'
import { FingerprintModule } from './fingerprint/fingerprint.module'
import { MailModule } from './mail/mail.module'

@Module({
	imports: [
		BullModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getBullmqConfig,
			inject: [ConfigService]
		}),

		MailModule,
		FingerprintModule,
		CloudinaryModule
	]
})
export class LibsModule {}
