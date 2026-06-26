import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory, Reflector } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import * as Multer from 'multer'

import { AppModule } from '@/app.module'
import { getCorsConfig, getHelmetConfig, getValidationPipeConfig } from '@/config'
import { LoggingInterceptor } from '@/shared/interceptors'
import { setupSwagger } from '@/shared/utils'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		rawBody: true
	})

	const config = app.get(ConfigService)
	const logger = new Logger(AppModule.name)

	app.set('trust proxy')

	app.use(helmet(getHelmetConfig()))
	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
	app.useGlobalInterceptors(new LoggingInterceptor())
	app.setGlobalPrefix('api/v1')

	app.useGlobalPipes(new ValidationPipe(getValidationPipeConfig()))
	app.enableCors(getCorsConfig(config))

	app.use(cookieParser())

	setupSwagger(app)

	const port = config.getOrThrow<number>('HTTP_PORT')
	const host = config.getOrThrow<string>('HTTP_HOST')

	try {
		await app.listen(port)

		logger.log(`🚀 Server is running at: ${host}`)
		logger.log(`📄 Documentation is available at: ${host}/docs`)
	} catch (error) {
		logger.error(`❌ Failed to start server: ${error.message}`, error)
		process.exit(1)
	}
}

void bootstrap()
