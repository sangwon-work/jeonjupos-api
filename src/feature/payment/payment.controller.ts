import {
  Controller,
  Req,
  Res,
  Request,
  Response,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ResponseUtil } from '../../shared/response/response.util';
import { AuthGuard } from '@nestjs/passport';
import { PaymentDto } from './dto/payment.dto';
import { PaymentFacadeService } from './facade/payment-facade.service';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly responseUtil: ResponseUtil,
    private readonly paymentFacadeService: PaymentFacadeService,
  ) {}

  /**
   * 결제
   * @param req
   * @param res
   * @param paymentDto
   */
  @Post('')
  @UseGuards(AuthGuard('access'))
  async cashPayment(
    @Req() req: Request,
    @Res() res: Response,
    @Body() paymentDto: PaymentDto,
  ) {
    try {
      const { storepkey } = req['user'];
      const { rescode } = await this.paymentFacadeService.payment(paymentDto);
      return this.responseUtil.response(res, 200, rescode, '', {});
    } catch (err) {
      return this.responseUtil.response(res, 500, '9999', '', {});
    }
  }
}
