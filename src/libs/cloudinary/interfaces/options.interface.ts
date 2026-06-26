import type { FactoryProvider, ModuleMetadata } from '@nestjs/common'

export const CloudinaryOptionsSymbol = Symbol('CLOUDINARY_OPTIONS')

export interface CloudinaryOptions {
	cloud_name: string
	api_key: string
	api_secret: string
}

export type CloudinaryAsyncOptions = Pick<ModuleMetadata, 'imports'> & Pick<FactoryProvider<CloudinaryOptions>, 'useFactory' | 'inject'>
