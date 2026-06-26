import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator'

export class CreateProgressRequest {
	@ApiProperty({
		description: 'Indicates whether the lesson is completed',
		example: true
	})
	@IsBoolean({ message: 'Значення має бути булевим (true/false)' })
	@IsNotEmpty({ message: 'Статус завершення уроку є обов’язковим' })
	public isCompleted: boolean

	@ApiProperty({
		description: 'Unique identifier of the lesson',
		example: '550e8400-e29b-41d4-a716-446655440000'
	})
	@IsString({ message: 'Ідентифікатор уроку має бути рядком' })
	@IsNotEmpty({ message: 'Ідентифікатор уроку є обов’язковим для заповнення' })
	public lessonId: string
}

export class CreateProgressResponse {
	@ApiProperty({
		description: 'Next lesson identifier or null if no next lesson exists',
		example: '550e8400-e29b-41d4-a716-446655440001'
	})
	public nextLesson: string

	@ApiProperty({
		description: 'Indicates whether the lesson is completed',
		example: true
	})
	public isCompleted: boolean
}
