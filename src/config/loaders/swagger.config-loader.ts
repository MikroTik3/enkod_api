import { DocumentBuilder } from '@nestjs/swagger'

export function getSwaggerConfig() {
	return new DocumentBuilder()
		.setTitle('ENCOD API')
		.setDescription('API for ENCOD learning platform')
		.setVersion('1.0.0')
		.setContact('ENCOD Support', 'https://docenko.vercel.app', 'dotsenk20034@gmail.com')
		.setLicense('AGPLv3', 'https://github.com/MikroTik3/enkod_api/blob/master/LICENSE')
		.build()
}
