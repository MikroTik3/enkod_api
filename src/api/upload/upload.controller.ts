import { Controller, HttpCode, HttpStatus, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { UserRole } from '@prisma/generated'

import { CloudinaryService } from '@/libs/cloudinary/cloudinary.service'
import { ApiFileUpload, Authorization } from '@/shared/decorators'

import { UploadResponse } from './dto'
import { UploadService } from './upload.service'

@Controller('upload')
export class UploadController {
	public constructor(
		private readonly uploadService: UploadService,
		private readonly cloudinaryService: CloudinaryService
	) {}

	@ApiOperation({ summary: 'Upload a file', description: 'Upload a file' })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'File successfully upload.',
		type: UploadResponse
	})
	@UseInterceptors(FilesInterceptor('files'))
	@Authorization(UserRole.ADMIN)
	@ApiFileUpload()
	@Post('/')
	@HttpCode(HttpStatus.CREATED)
	public async uploadFile(@UploadedFiles() files: Express.Multer.File[]) {
		return this.uploadService.uploads(files)
	}

	@ApiOperation({
		summary: 'Destroy a file',
		description: 'Destroy a file'
	})
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: 'File successfully destroy.'
	})
	@Authorization(UserRole.ADMIN)
	@Post('destroy/:public_id')
	@HttpCode(HttpStatus.CREATED)
	async destroyFile(@Param('public_id') public_id: string) {
		return await this.cloudinaryService.destroy(public_id)
	}
}
