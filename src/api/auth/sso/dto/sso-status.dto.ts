import { ApiProperty } from '@nestjs/swagger'

export class SsoStatusResponse {
	@ApiProperty({
		description: 'Indicates whether the Google account is connected',
		example: false
	})
	public google: boolean

	@ApiProperty({
		description: 'Indicates whether the Telegram account is connected',
		example: false
	})
	public telegram: boolean

	@ApiProperty({
		description: 'Indicates whether the Discord account is connected',
		example: false
	})
	public discord: boolean
}
