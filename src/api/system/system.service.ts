import { Injectable } from '@nestjs/common'

@Injectable()
export class SystemService {
	public hello() {
		return {
			message: 'Welcome to Encod API'
		}
	}

	public async health() {
		return {
			status: 'ok',
			timestamp: new Date().toISOString()
		}
	}
}
