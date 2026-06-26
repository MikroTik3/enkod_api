import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

import { LoginSessionResponse } from '../../session/dto'

export class CreateUserRequest {
	@ApiProperty({
		description: 'Display name',
		example: 'John Doe'
	})
	@IsString({ message: `Ім'я має бути рядком` })
	@IsNotEmpty({ message: `Ім'я обов'язкове для заповнення` })
	@MaxLength(50, { message: `Ім'я не повинно перевищувати 50 символів` })
	public name: string

	@ApiProperty({
		description: 'Email address',
		example: 'john.doe@example.com'
	})
	@IsString({ message: 'Електронна пошта повинна бути рядком' })
	@IsEmail({}, { message: 'Некоректний формат електронної пошти' })
	@IsNotEmpty({ message: `Електронна пошта обов'язкова для заповнення` })
	public email: string

	@ApiProperty({
		description: 'Password',
		example: '123456',
		minLength: 6,
		maxLength: 128
	})
	@IsString({ message: 'Пароль має бути рядком' })
	@IsNotEmpty({ message: `Пароль обов'язковий для заповнення` })
	@MinLength(6, {
		message: 'Пароль повинен містити не менше 6 символів'
	})
	@MaxLength(128, {
		message: 'Пароль повинен містити не більше 128 символів'
	})
	public password: string

	@ApiProperty({
		description: 'Captcha verification code',
		example: '03AFcWeA...'
	})
	@IsString({ message: 'Капча має бути рядком' })
	@IsNotEmpty({ message: `Капча обов'язкова` })
	public captcha: string

	@ApiProperty({
		description: 'Fingerprint visitor ID',
		example: 'a6a0e0923e18fdb091e3c9c29d69d1d0',
		required: false
	})
	@IsString({ message: 'visitorId повинен бути рядком' })
	@IsOptional()
	public visitorId?: string

	@ApiProperty({
		description: 'Fingerprint request ID',
		example: 'dbe7b3b8-22f4-4b89-9db9-f8e3798a2b1e',
		required: false
	})
	@IsString({ message: 'requestId повинен бути рядком' })
	@IsOptional()
	public requestId?: string
}

export class CreateUserResponse extends LoginSessionResponse {}
