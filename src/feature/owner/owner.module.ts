import { Module } from '@nestjs/common';
import { OwnerController } from './owner.controller';
import { OwnerLoginService } from './services/owner-login.service';
import { OwnerModel } from './owner.model';
import { JwtSignUtil } from '../common/jwt-sign.util';
import { OwnerCreateService } from './services/owner-create.service';

@Module({
  controllers: [OwnerController],
  providers: [OwnerLoginService, OwnerCreateService, OwnerModel, JwtSignUtil],
})
export class OwnerModule {}
