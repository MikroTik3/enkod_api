import { ApiProperty } from '@nestjs/swagger'

export class MeStatisticsResponse {
	@ApiProperty({
		description: 'Total number of user points',
		example: 1200
	})
	public totalPoints: number

	@ApiProperty({
		description: 'User ranking position (the lower the number, the higher the rank)',
		example: 5
	})
	public ranking: number

	@ApiProperty({
		description: 'Number of completed lessons and total lessons (in X/Y format)',
		example: '12/50'
	})
	public lessonsCompleted: string

	@ApiProperty({
		description: 'Learning progress percentage',
		example: 24
	})
	public learningProgressPercentage: number

	@ApiProperty({
		description: 'Number of completed courses (all lessons finished)',
		example: 3
	})
	public completedCourses: number

	@ApiProperty({
		description: 'Number of courses currently in progress (started but not yet completed)',
		example: 2
	})
	public coursesInProgress: number
}
