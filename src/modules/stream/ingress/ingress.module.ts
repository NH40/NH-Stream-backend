import { Module } from '@nestjs/common'

import { IngressResolver } from './ingress.resolver'
import { IngressService } from './ingress.service'

@Module({
	providers: [IngressResolver, IngressService]
})
export class IngressModule {}
