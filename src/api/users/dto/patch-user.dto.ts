import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class PatchUserRequest {
	@ApiProperty({
		description: 'Display name',
		example: 'John Doe'
	})
	@IsString({ message: "Ім'я повинно бути рядком" })
	@IsNotEmpty({ message: "Ім'я є обов'язковим для заповнення" })
	@MaxLength(50, {
		message: "Ім'я не повинно перевищувати 50 символів"
	})
	public displayName: string
}
