import { Module } from '@nestjs/common'

import { IngressModule } from './ingress/ingress.module'
import { StreamResolver } from './stream.resolver'
import { StreamService } from './stream.service'

@Module({
	providers: [StreamResolver, StreamService],
	imports: [IngressModule]
})
export class StreamModule {}
