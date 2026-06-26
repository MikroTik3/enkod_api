import { registerAs } from '@nestjs/config'

import { validateEnv } from '../../shared/utils/validate-env'
import type { HostsConfig } from '../definitions'
import { HostsValidator } from '../validators'

export const hostsEnv = registerAs<HostsConfig>('hosts', () => {
	validateEnv(process.env, HostsValidator)

	return {
		rest: process.env.HOSTS_REST,
		app: process.env.HOSTS_APP
	}
})
