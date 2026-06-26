import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { v2 as cloudinary, type UploadApiErrorResponse, type UploadApiResponse } from 'cloudinary'
import { Readable } from 'stream'

import { CloudinaryOptions, CloudinaryOptionsSymbol } from './interfaces'

@Injectable()
export class CloudinaryService {
	public constructor(
		@Inject(CloudinaryOptionsSymbol)
		private readonly options: CloudinaryOptions
	) {
		cloudinary.config({
			cloud_name: options.cloud_name,
			api_key: options.api_key,
			api_secret: options.api_secret
		})
	}

	public async upload(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
		try {
			return new Promise((resolve, reject) => {
				const upload = cloudinary.uploader.upload_stream(
					{
						format: 'webp'
					},
					(error, result) => {
						if (error) return reject(error)
						if (!result) return reject(new Error('Upload result is undefined'))

						resolve(result)
					}
				)

				const stream = new Readable()
				stream.push(file.buffer)
				stream.push(null)

				stream.pipe(upload)
			})
		} catch (error) {
			throw new BadRequestException(`Failed to upload file from cloudinary: ${error.message}`)
		}
	}

	public async destroy(public_id: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
		try {
			return await cloudinary.uploader.destroy(public_id)
		} catch (error) {
			throw new BadRequestException(`Failed to destroy file from cloudinary: ${error.message}`)
		}
	}
}
