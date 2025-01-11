import { ConfigService } from '@nestjs/config'

import { TypeStripeOptions } from '@/src/modules/libs/stripe/types/stripe.types'

export function getStripeConfig(
	configService: ConfigService
): TypeStripeOptions {
	return {
		apiKey: configService.getOrThrow<string>('STRIPE_SECRET_KEY'),
		config: {
			apiVersion: '2024-12-18.acacia'
		}
	}
}
