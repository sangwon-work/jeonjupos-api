import { Controller, Post, Body, UseGuards, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentDto } from './dto/payment.dto';
import { PaymentFacadeService } from './facade/payment-facade.service';
import { respond } from '../../shared/utils/response/response';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentFacadeService: PaymentFacadeService) {}

  /**
   * 결제
   * @param paymentDto
   */
  @Post('')
  @HttpCode(200)
  @UseGuards(AuthGuard('access'))
  async cashPayment(@Body() paymentDto: PaymentDto) {
    const { rescode } = await this.paymentFacadeService.payment(paymentDto);
    return respond(rescode, '', {});
  }
}
