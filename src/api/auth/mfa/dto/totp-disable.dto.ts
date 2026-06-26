import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class TotpDisableRequest {
	@ApiProperty({
		description: 'Password',
		example: '123456',
		minLength: 6,
		maxLength: 128
	})
	@IsString({ message: 'Пароль має бути рядком' })
	@IsNotEmpty({ message: `Пароль обов'язковий для заповнення` })
	@MinLength(6, { message: 'Пароль повинен містити не менше 6 символів' })
	@MaxLength(128, {
		message: 'Пароль повинен містити не більше 128 символів'
	})
	public password: string
}
