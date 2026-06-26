import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CreateLessonRequest {
	@ApiProperty({
		description: 'Lesson title',
		example: 'Introduction to TypeScript'
	})
	@IsString({ message: 'Назва уроку має бути рядком' })
	@IsNotEmpty({ message: 'Назва уроку є обов’язковою для заповнення' })
	@MaxLength(255, {
		message: 'Назва уроку не повинна перевищувати 255 символів'
	})
	public title: string

	@ApiProperty({
		description: 'Course ID to which the lesson belongs',
		example: '550e8400-e29b-41d4-a716-446655440000'
	})
	@IsString({ message: 'Ідентифікатор курсу має бути рядком' })
	@IsNotEmpty({ message: 'Ідентифікатор курсу є обов’язковим для заповнення' })
	public courseId: string
}

export class CreateLessonResponse {
	@ApiProperty({
		description: 'Unique lesson identifier',
		example: '550e8400-e29b-41d4-a716-446655440001'
	})
	public id: string
}
