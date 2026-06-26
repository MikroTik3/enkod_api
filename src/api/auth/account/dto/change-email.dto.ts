import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class ChangeEmailRequest {
	@ApiProperty({
		description: 'Email address',
		example: 'john.doe@example.com'
	})
	@IsString({ message: 'Електронна пошта повинна бути рядком' })
	@IsEmail({}, { message: 'Некоректний формат електронної пошти' })
	@IsNotEmpty({ message: `Електронна пошта обов'язкова для заповнення` })
	public email: string
}
