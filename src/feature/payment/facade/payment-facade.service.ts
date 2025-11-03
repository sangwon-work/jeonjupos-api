import { Injectable } from '@nestjs/common';
import { PaymentDto } from '../dto/payment.dto';
import { GetPayInfoService } from '../service/get-pay-info.service';
import { PaymentService } from '../service/payment.service';

@Injectable()
export class PaymentFacadeService {
  constructor(
    private readonly getPayInfoService: GetPayInfoService,
    private readonly paymentService: PaymentService,
  ) {}

  async payment(paymentDto: PaymentDto) {
    try {
      const { payinfoset } = await this.getPayInfoService.getPayInfo(
        paymentDto.orderinfopkey,
      ); // 주문서 조회

      if (payinfoset.length === 1) {
        const payinfo = payinfoset[0];
        // 결재내역 저장 및 결제정보 상태 변경
        const { rescode } = await this.paymentService.createPayment(
          payinfo,
          paymentDto.paytype,
          paymentDto.payamount,
        );
        return { rescode: rescode };
      } else {
        // 결제정보를 찾을 수 없습니다.
        return { rescode: '0005' };
      }
    } catch (err) {
      throw err;
    }
  }
}
