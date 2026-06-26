import { ConfigService } from '@nestjs/config'

import { CloudinaryOptions } from '@/libs/cloudinary/interfaces'

import { AllConfigs } from '../definitions'

export function getCloudinaryConfig(configService: ConfigService<AllConfigs>): CloudinaryOptions {
	return {
		cloud_name: configService.get('cloudinary.cloud_name', { infer: true }),
		api_key: configService.get('cloudinary.api_key', { infer: true }),
		api_secret: configService.get('cloudinary.api_secret', { infer: true })
	}
}
