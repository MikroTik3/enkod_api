import { DiscordProvider, GithubProvider, GoogleProvider, SentinelOptions, TelegramProvider } from '@docenko/sentinel-auth'
import { ConfigService } from '@nestjs/config'

import type { AllConfigs } from '../definitions'

export function getOAuthConfig(configService: ConfigService<AllConfigs>): SentinelOptions {
	return {
		baseUrl: `${configService.get('hosts.rest', { infer: true })}/api/v1`,
		services: [
			new GoogleProvider({
				clientId: configService.get('sentinel.google.clientId', {
					infer: true
				}),
				clientSecret: configService.get('sentinel.google.clientSecret', {
					infer: true
				}),
				scopes: ['email', 'profile']
			}),
			new DiscordProvider({
				clientId: configService.get('sentinel.discord.clientId', {
					infer: true
				}),
				clientSecret: configService.get('sentinel.discord.clientSecret', {
					infer: true
				}),
				scopes: ['identify', 'email']
			}),
			new GithubProvider({
				clientId: configService.get('sentinel.github.clientId', {
					infer: true
				}),
				clientSecret: configService.get('sentinel.github.clientSecret', {
					infer: true
				}),
				scopes: ['user:email', 'user:profile']
			}),
			new TelegramProvider({
				clientId: configService.get('sentinel.telegram.clientId', {
					infer: true
				}),
				clientSecret: configService.get('sentinel.telegram.clientSecret', {
					infer: true
				}),
				scopes: ['openid', 'profile']
			})
		]
	}
}
