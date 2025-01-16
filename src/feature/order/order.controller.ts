import {
  Controller,
  Req,
  Res,
  Request,
  Response,
  Get,
  Post,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ResponseUtil } from '../../shared/response/response.util';
import { AuthGuard } from '@nestjs/passport';
import { GetOrderListDto } from './dto/get-order-list.dto';
import { GetOrderInfoFacadeService } from './facade/get-order-info-facade.service';

@Controller('order')
export class OrderController {
  constructor(
    private readonly responseUtil: ResponseUtil,
    private readonly getOrderInfoFacadeService: GetOrderInfoFacadeService,
  ) {}

  /**
   * 주문 정보 조회
   * @param req
   * @param res
   * @param getOrderListDto
   */
  @Get('/info')
  @UseGuards(AuthGuard('access'))
  async getOrderList(
    @Req() req: Request,
    @Res() res: Response,
    @Query() getOrderListDto: GetOrderListDto,
  ) {
    try {
      const { storepkey } = req['user'];
      const { rescode, data } =
        await this.getOrderInfoFacadeService.getOrderInfo(
          storepkey,
          getOrderListDto,
        );
      return this.responseUtil.response(res, 200, rescode, '', data);
    } catch (err) {
      return this.responseUtil.response(res, 500, '9999', '', {});
    }
  }

  /**
   * 주문
   * @param req
   * @param res
   */
  @Post('')
  @UseGuards(AuthGuard('access'))
  async createOrder(@Req() req: Request, @Res() res: Response) {
    try {
      const { storepkey } = req['user'];
      return this.responseUtil.response(res, 200, '0000', '', {});
    } catch (err) {
      return this.responseUtil.response(res, 500, '9999', '', {});
    }
  }
}
