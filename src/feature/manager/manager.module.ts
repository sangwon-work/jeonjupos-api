import { Module } from '@nestjs/common';
import { ManagerController } from './manager.controller';
import { ManagerModel } from './manager.model';
import { GetManagerByMidService } from './service/get-manager-by-mid.service';
import { LoginFacadeService } from './facade/login-facade.service';

@Module({
  controllers: [ManagerController],
  providers: [ManagerModel, GetManagerByMidService, LoginFacadeService],
})
export class ManagerModule {}
