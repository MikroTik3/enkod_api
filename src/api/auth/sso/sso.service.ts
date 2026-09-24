import { AllowedProvider, SentinelService } from '@docenko/sentinel-auth'
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AccountProvider, EmailVerificationStatus, type User } from '@prisma/generated'
import { randomBytes } from 'crypto'

import { ManagerBotService } from '@/bots/manager/manager.bot.service'
import { AllConfigs } from '@/config/definitions'
import { PrismaService } from '@/infra/prisma/prisma.service'
import { RedisService } from '@/infra/redis/redis.service'
import { slugify } from '@/shared/utils/slugify'

@Injectable()
export class SsoService {
	private readonly TELEGRAM_BOT_ID: string
	private readonly TELEGRAM_BOT_TOKEN: string

	private readonly providerMap: Record<string, AccountProvider> = {
		google: AccountProvider.GOOGLE,
		discord: AccountProvider.DISCORD,
		github: AccountProvider.GITHUB,
		telegram: AccountProvider.TELEGRAM
	}

	public constructor(
		private readonly prismaService: PrismaService,
		private readonly redisService: RedisService,
		private readonly configService: ConfigService<AllConfigs>,
		private readonly sentinelService: SentinelService,
		private readonly botService: ManagerBotService
	) {
		this.TELEGRAM_BOT_TOKEN = this.configService.get('telegram.managerToken', { infer: true })
		this.TELEGRAM_BOT_ID = this.TELEGRAM_BOT_TOKEN.split(':')[0]
	}

	public async getAvailableMethods() {
		return ['google', 'discord', 'github', 'telegram']
	}

	public async fetchStatus(user: User) {
		const accounts = await this.prismaService.externalAccount.findMany({
			where: {
				userId: user.id
			}
		})

		const status = {
			google: accounts.some(account => account.provider === AccountProvider.GOOGLE),
			discord: accounts.some(account => account.provider === AccountProvider.DISCORD),
			github: accounts.some(account => account.provider === AccountProvider.GITHUB),
			telegram: accounts.some(account => account.provider === AccountProvider.TELEGRAM)
		}

		return status
	}

	public async connect(provider: AllowedProvider, code: string, userId: string) {
		const external = await this.sentinelService.findService(provider).getUserByCode(code)
		const providerEnum = this.providerMap[provider]

		const existing = await this.prismaService.externalAccount.findUnique({
			where: {
				providerAccountId: external.id
			}
		})

		if (existing) {
			throw new ConflictException("Цей обліковий запис вже прив'язаний до іншого користувача")
		}

		const sameEmailAccount = await this.prismaService.externalAccount.findFirst({
			where: {
				provider: providerEnum,
				user: {
					email: external.email
				}
			}
		})

		if (sameEmailAccount) {
			throw new ConflictException(`Акаунт з цією поштою вже прив'язаний через ${provider}`)
		}

		await this.prismaService.externalAccount.create({
			data: {
				provider: providerEnum,
				providerAccountId: external.id,
				refreshToken: external.refreshToken,
				accessToken: external.accessToken,
				expiry: external.expiry,
				user: {
					connect: {
						id: userId
					}
				}
			}
		})

		return true
	}

	public async login(provider: AllowedProvider, code: string, ip: string, userAgent: string, options?: { visitorId?: string; requestId?: string }) {
		const external = await this.sentinelService.findService(provider).getUserByCode(code)

		const providerEnum = this.providerMap[provider]

		const account = await this.prismaService.externalAccount.findUnique({
			where: {
				providerAccountId: external.id
			},
			include: {
				user: true
			}
		})

		let user: User | null = account?.user ?? null
		let isNewUser = false

		if (!user) {
			if (provider === AllowedProvider.TELEGRAM) {
				user = await this.prismaService.user.create({
					data: {
						displayName: external.name,
						username: external ? `${randomBytes(16).toString('hex')}_${external.username}` : randomBytes(16).toString('hex'),
						avatar: external.avatar,

						externalAccounts: {
							create: {
								provider: providerEnum,
								providerAccountId: external.id,
								refreshToken: external.refreshToken,
								accessToken: external.accessToken,
								expiry: external.expiry
							}
						}
					}
				})

				isNewUser = true
			} else {
				user = await this.prismaService.user.findUnique({
					where: {
						email: external.email
					}
				})

				if (user) {
					const alreadyLinked = await this.prismaService.externalAccount.findFirst({
						where: {
							provider: providerEnum,
							userId: user.id
						}
					})

					if (!alreadyLinked) {
						await this.prismaService.externalAccount.create({
							data: {
								provider: providerEnum,
								providerAccountId: external.id,
								refreshToken: external.refreshToken,
								accessToken: external.accessToken,
								expiry: external.expiry,
								user: {
									connect: {
										id: user.id
									}
								}
							}
						})
					}
				} else {
					const token = randomBytes(64).toString('hex')

					user = await this.prismaService.user.create({
						data: {
							displayName: external.name,
							username: slugify(`${external.email}-${external.name}`),
							email: external.email,
							avatar: external.avatar,

							emailVerification: {
								create: {
									status: EmailVerificationStatus.VERIFIED,
									token,
									expiry: null
								}
							},

							externalAccounts: {
								create: {
									provider: providerEnum,
									providerAccountId: external.id,
									refreshToken: external.refreshToken,
									accessToken: external.accessToken,
									expiry: external.expiry
								}
							}
						}
					})

					isNewUser = true
				}
			}
		}

		const session = await this.redisService.createSession(user, {
			ip,
			userAgent,
			visitorId: options?.visitorId,
			requestId: options?.requestId
		})

		if (isNewUser) {
			const userSession = await this.redisService.getUserSession(session.id)

			await this.botService.sendNewUser(user, userSession)
		}

		return session
	}

	public async unlink(provider: AllowedProvider, user: User) {
		const account = await this.prismaService.externalAccount.findUnique({
			where: {
				userId_provider: {
					userId: user.id,
					provider: this.providerMap[provider]
				}
			}
		})

		if (!account) throw new NotFoundException('External account not found')

		await this.prismaService.externalAccount.delete({
			where: {
				userId_provider: {
					userId: user.id,
					provider: this.providerMap[provider]
				}
			}
		})

		return true
	}
}
