import { SentinelService } from '@docenko/sentinel-auth'
import { type CanActivate, type ExecutionContext, Injectable, NotFoundException } from '@nestjs/common'
import { AccountProvider } from '@prisma/generated'
import type { Request } from 'express'

@Injectable()
export class ProviderGuard implements CanActivate {
	public constructor(private readonly sentinelService: SentinelService) {}

	public canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest<Request>()
		const provider = String(request.params.provider).toUpperCase() as keyof typeof AccountProvider

		if (!(provider in AccountProvider)) throw new NotFoundException('Провайдера не знайдено')

		const providerEnum = AccountProvider[provider]

		if (providerEnum !== AccountProvider.TELEGRAM) {
			const providerInstance = this.sentinelService.findService(providerEnum.toLowerCase())

			if (!providerInstance) {
				throw new NotFoundException('Провайдера не знайдено в SentinelService')
			}
		}

		return true
	}
}
