import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class TotpEnableRequest {
	@ApiProperty({
		description: 'PIN code for enabling TOTP 2FA',
		example: '123456',
		minLength: 6,
		maxLength: 6
	})
	@IsString({ message: 'PIN має бути рядком' })
	@IsNotEmpty({ message: `PIN обов'язковий для заповнення` })
	@MinLength(6, { message: 'PIN повинен містити 6 символів' })
	@MaxLength(6, { message: 'PIN повинен містити не більше 6 символів' })
	public pin: string

	@ApiProperty({
		description: 'TOTP secret key',
		example: 'JBSWY3DPEHPK3PXP'
	})
	@IsString({ message: 'Секрет повинен бути рядком' })
	@IsNotEmpty({ message: "Секрет обов'язковий для заповнення" })
	public secret: string
}
