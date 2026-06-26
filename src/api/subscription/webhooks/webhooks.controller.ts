import { Controller, Headers, HttpCode, HttpStatus, Ip, Post, Req } from '@nestjs/common'
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger'

import { WebhooksService } from './webhooks.service'

@Controller('webhooks/monobank')
export class WebhooksController {
	constructor(private readonly webhooksService: WebhooksService) {}

	@ApiOperation({ summary: 'Monobank charge webhook' })
	@ApiOkResponse({ schema: { example: { ok: true } } })
	@Post('charge')
	@HttpCode(HttpStatus.OK)
	public async charge(@Req() req: any, @Headers('x-sign') signature: string, @Ip() ip: string) {
		const rawBody = req.rawBody?.toString('utf8')

		await this.webhooksService.charge({
			rawBody,
			signature,
			payload: JSON.parse(rawBody),
			ip
		})

		return { ok: true }
	}

	@ApiOperation({ summary: 'Monobank subscription status webhook' })
	@ApiOkResponse({ schema: { example: { ok: true } } })
	@Post('status')
	@HttpCode(HttpStatus.OK)
	public async status(@Req() req: any, @Headers('x-sign') signature: string, @Ip() ip: string) {
		const rawBody = req.rawBody?.toString('utf8')

		await this.webhooksService.status({
			rawBody,
			signature,
			payload: JSON.parse(rawBody),
			ip
		})

		return { ok: true }
	}
}
