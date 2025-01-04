import { Module } from '@nestjs/common';
import { TotpService } from './totp.service';
import { TotpResolver } from './totp.resolver';

@Module({
  providers: [TotpResolver, TotpService],
})
export class TotpModule {}
