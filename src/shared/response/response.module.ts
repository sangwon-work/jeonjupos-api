import { Module } from '@nestjs/common';
import { ResponseUtil } from './response.util';

@Module({
  providers: [ResponseUtil],
  exports: [ResponseUtil],
})
export class ResponseModule {}
