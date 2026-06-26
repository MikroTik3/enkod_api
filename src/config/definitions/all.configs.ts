import type { AppConfig } from './app.config'
import type { CloudinaryConfig } from './cloudinary.config'
import type { FingerprintConfig } from './fingerprint.config'
import type { HostsConfig } from './hosts.config'
import type { KinescopeConfig } from './kinescope.config'
import type { MailerConfig } from './mailer.config'
import type { MonobankConfig } from './monobank.config'
import type { QueueConfig } from './queue.config'
import type { RedisConfig } from './redis.config'
import type { SentinelConfig } from './sentinel.config'
import type { TelegramConfig } from './telegram.config'
import type { TurnstileConfig } from './turnstile.config'
import type { WebAuthnConfig } from './webauthn.config'

export interface AllConfigs {
	app: AppConfig
	fingerprint: FingerprintConfig
	cloudinary: CloudinaryConfig
	hosts: HostsConfig
	mailer: MailerConfig
	kinescope: KinescopeConfig
	queue: QueueConfig
	redis: RedisConfig
	monobank: MonobankConfig
	sentinel: SentinelConfig
	telegram: TelegramConfig
	turnstile: TurnstileConfig
	webauthn: WebAuthnConfig
}
