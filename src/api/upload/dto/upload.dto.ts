import { ApiProperty } from '@nestjs/swagger'

export class UploadResponse {
	@ApiProperty({
		description: 'Список URL-адрес завантажених файлів',
		example: ['https://cdn.example.com/uploads/file1.jpg', 'https://cdn.example.com/uploads/file2.png']
	})
	urls: string[]
}
