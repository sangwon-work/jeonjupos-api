import { Module } from '@nestjs/common';
import { PaymentFacadeService } from './facade/payment-facade.service';
import { PaymentService } from './service/payment.service';
import { PaymentModel } from './payment.model';
import { PaymentController } from './payment.controller';
import { GetPayInfoService } from './service/get-pay-info.service';

@Module({
  controllers: [PaymentController],
  providers: [
    PaymentModel,
    PaymentFacadeService,
    PaymentService,
    GetPayInfoService,
  ],
})
export class PaymentModule {}
