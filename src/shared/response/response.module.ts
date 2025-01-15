import { Global, Module } from '@nestjs/common';
import { ResponseUtil } from './response.util';

@Global()
@Module({
  providers: [ResponseUtil],
  exports: [ResponseUtil],
})
export class ResponseModule {}
