import { Module } from '@nestjs/common'

import { DeactivateResolver } from './deactivate.resolver'
import { DeactivateService } from './deactivate.service'

@Module({
	providers: [DeactivateResolver, DeactivateService]
})
export class DeactivateModule {}
