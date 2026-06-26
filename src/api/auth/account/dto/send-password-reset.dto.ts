import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SendPasswordResetRequest {
	@ApiProperty({
		description: 'Email associated with the account',
		example: 'john.doe@example.com'
	})
	@IsString({ message: 'Електронна пошта повинна бути рядком' })
	@IsEmail({}, { message: 'Некоректний формат електронної пошти' })
	@IsNotEmpty({ message: `Електронна пошта обов'язкова для заповнення` })
	public email: string

	@ApiProperty({
		description: 'Captcha verification code',
		example: '03AFcWeA...'
	})
	@IsString({ message: 'Капча має бути рядком' })
	@IsNotEmpty({ message: `Капча обов'язкова` })
	public captcha: string
}
