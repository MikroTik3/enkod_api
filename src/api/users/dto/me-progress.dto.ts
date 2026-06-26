import { ApiProperty } from '@nestjs/swagger'

export class LastLessonResponse {
	@ApiProperty({
		description: 'Unique identifier',
		example: '550e8400-e29b-41d4-a716-446655440000'
	})
	public id: string

	@ApiProperty({
		description: 'Unique lesson slug',
		example: 'getting-started'
	})
	public slug: string

	@ApiProperty({
		description: 'Lesson position in the course',
		example: 1
	})
	public position: number
}

export class MeProgressResponse {
	@ApiProperty({
		description: 'Unique course identifier',
		example: 'course_123'
	})
	public id: string

	@ApiProperty({
		description: 'Course title',
		example: 'TypeScript Fundamentals'
	})
	public title: string

	@ApiProperty({
		description: 'Total number of lessons in the course',
		example: 20
	})
	public totalLessons: number

	@ApiProperty({
		description: 'Number of lessons completed by the user',
		example: 5
	})
	public completedLessons: number

	@ApiProperty({
		description: 'Course completion progress in percentage',
		example: 25
	})
	public progress: number

	@ApiProperty({
		description: 'Date of the latest course activity (last access)',
		example: '2023-05-15T12:00:00.000Z'
	})
	public lastAccessed: string

	@ApiProperty({
		description: 'Last viewed lesson',
		type: LastLessonResponse,
		nullable: true
	})
	public lastLesson: LastLessonResponse | null
}
