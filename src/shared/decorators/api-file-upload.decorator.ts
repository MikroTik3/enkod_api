import { applyDecorators } from '@nestjs/common'
import { ApiBody, ApiConsumes } from '@nestjs/swagger'

export function ApiFileUpload() {
	return applyDecorators(
		ApiConsumes('multipart/form-data'),
		ApiBody({
			schema: {
				type: 'object',
				properties: {
					files: {
						type: 'array',
						items: {
							type: 'string',
							format: 'binary'
						}
					}
				}
			}
		})
	)
}
