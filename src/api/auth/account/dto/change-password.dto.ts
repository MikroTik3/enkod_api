import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength, MinLength, ValidateIf } from 'class-validator'

export class ChangePasswordRequest {
	@ApiProperty({
		description: 'New password',
		example: '654321',
		minLength: 6,
		maxLength: 128
	})
	@IsString({ message: 'Новий пароль повинен бути рядком' })
	@IsNotEmpty({ message: 'Новий пароль не може бути порожнім' })
	@MinLength(6, {
		message: 'Новий пароль повинен містити не менше 6 символів'
	})
	@MaxLength(128, {
		message: 'Новий пароль повинен містити не більше 128 символів'
	})
	public newPassword: string

	@ApiProperty({
		description: 'Confirmation of the new password',
		example: '654321',
		minLength: 6,
		maxLength: 128
	})
	@IsString({ message: 'Підтвердження пароля має бути рядком' })
	@IsNotEmpty({ message: 'Підтвердження пароля не може бути порожнім' })
	@MinLength(6, {
		message: 'Підтвердження пароля повинно містити не менше 6 символів'
	})
	@MaxLength(128, {
		message: 'Підтвердження пароля повинно містити не більше 128 символів'
	})
	@ValidateIf(o => o.newPassword === o.confirmPassword, {
		message: 'Паролі не співпадають'
	})
	public confirmPassword: string
}
