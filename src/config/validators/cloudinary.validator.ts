import { IsString } from 'class-validator'

export class CloudinaryValidator {
	@IsString()
	public CLOUDINARY_API_KEY: string

	@IsString()
	public CLOUDINARY_API_NAME: string

	@IsString()
	public CLOUDINARY_API_SECRET: string
}
