import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { ThrottlerModule } from '@nestjs/throttler'
import { TurnstileModule } from 'nestjs-cloudflare-turnstile'

import { getCloudinaryConfig, getFingerprintConfig, getThrottlerConfig, getTurnstileConfig } from '@/config'
import { CloudinaryModule } from '@/libs/cloudinary/cloudinary.module'
import { FingerprintModule } from '@/libs/fingerprint/fingerprint.module'
import { EnhancedThrottlerGuard } from '@/shared/guards'

import { AccountModule } from './auth/account/account.module'
import { MfaModule } from './auth/mfa/mfa.module'
import { PasskeyModule } from './auth/passkey/passkey.module'
import { SessionModule } from './auth/session/session.module'
import { SsoModule } from './auth/sso/sso.module'
import { CourseModule } from './course/course.module'
import { LessonModule } from './lesson/lesson.module'
import { ProgressModule } from './progress/progress.module'
import { RestrictionModule } from './restriction/restriction.module'
import { SubscriptionModule } from './subscription/subscription.module'
import { SystemModule } from './system/system.module'
import { UploadModule } from './upload/upload.module'
import { UsersModule } from './users/users.module'

@Module({
	imports: [
		ThrottlerModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getThrottlerConfig,
			inject: [ConfigService]
		}),
		TurnstileModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getTurnstileConfig,
			inject: [ConfigService]
		}),
		FingerprintModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getFingerprintConfig,
			inject: [ConfigService]
		}),
		CloudinaryModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: getCloudinaryConfig,
			inject: [ConfigService]
		}),

		ScheduleModule.forRoot(),

		AccountModule,
		MfaModule,
		PasskeyModule,
		SessionModule,
		SsoModule,

		ProgressModule,
		RestrictionModule,
		CourseModule,
		LessonModule,

		SubscriptionModule,

		UsersModule,
		SystemModule,
		UploadModule
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: EnhancedThrottlerGuard
		}
	]
})
export class ApiModule {}
