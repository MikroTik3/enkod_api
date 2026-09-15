import { config } from 'dotenv'
import { defineConfig, env } from 'prisma/config'

config()

export default defineConfig({
	schema: 'prisma/schema.prisma',
	datasource: {
		url: process.env.POSTGRES_URI || env('POSTGRES_URI'),
	}
})
