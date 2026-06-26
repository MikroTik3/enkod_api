import { ApiExtraModels, ApiProperty, getSchemaPath } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

import { Session } from '@/shared/interfaces'

export class LoginRequest {
	@ApiProperty({
		description: 'Email address',
		example: 'john.doe@example.com'
	})
	@IsString({ message: 'Електронна пошта повинна бути рядком' })
	@IsEmail({}, { message: 'Некоректний формат електронної пошти' })
	@IsNotEmpty({ message: 'Електронна пошта є обов’язковою для заповнення' })
	public email: string

	@ApiProperty({
		description: 'Password',
		example: '123456',
		minLength: 6,
		maxLength: 128
	})
	@IsString({ message: 'Пароль повинен бути рядком' })
	@IsNotEmpty({ message: 'Поле пароль не може бути порожнім' })
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
	@IsString({ message: 'Капча повинна бути рядком' })
	@IsNotEmpty({ message: 'Капча є обов’язковою' })
	public captcha: string

	@ApiProperty({
		description: 'Fingerprint visitor ID',
		example: 'g8GhE1JtVZ9xYkLm',
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

export class LoginSessionResponse implements Session {
	@ApiProperty({
		description: 'Unique session identifier',
		example: '550e8400-e29b-41d4-a716-446655440000'
	})
	public id: string

	@ApiProperty({
		description: 'Session token',
		example: '261527f4958ee90eb3ff34ba59154f468c241b0f026340d38c882d70b1b18eb3d7128c9e7d085e76'
	})
	public token: string

	@ApiProperty({
		description: 'Unique user identifier',
		example: '08a96e4b-7b23-4e65-a23f-49a6f2e5d8f1'
	})
	public userId: string
}

export class LoginMfaResponse {
	@ApiProperty({
		description: 'MFA ticket for further verification',
		example: 'bff74763b7697eb38664d28a41937a2887648a2f'
	})
	public ticket: string

	@ApiProperty({
		description: 'Allowed MFA methods',
		example: ['Totp', 'Recovery']
	})
	public allowedMethods: string[]

	@ApiProperty({
		description: 'Unique user identifier',
		example: '84ac0c40-dc6e-4df0-b7bf-9df220fd994a'
	})
	public userId: string
}

@ApiExtraModels(LoginSessionResponse, LoginMfaResponse)
export class LoginResponse {
	@ApiProperty({
		description: 'name',
		oneOf: [{ $ref: getSchemaPath(LoginSessionResponse) }, { $ref: getSchemaPath(LoginMfaResponse) }],
		type: () => Object
	})
	name: LoginSessionResponse | LoginMfaResponse
}
