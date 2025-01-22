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
import { FirstOrderDto } from './dto/first-order.dto';
import { ReOrderDto } from './dto/re-order.dto';

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
   * 첫주문
   * @param req
   * @param res
   * @param firstOrderDto
   */
  @Post('/first')
  @UseGuards(AuthGuard('access'))
  async firstOrder(
    @Req() req: Request,
    @Res() res: Response,
    @Body() firstOrderDto: FirstOrderDto,
  ) {
    try {
      const { storepkey } = req['user'];
      return this.responseUtil.response(res, 200, '0000', '', {});
    } catch (err) {
      return this.responseUtil.response(res, 500, '9999', '', {});
    }
  }

  /**
   * 재주문
   * @param req
   * @param res
   * @param reOrderDto
   */
  @Post('/reorder')
  @UseGuards(AuthGuard('access'))
  async reOrder(
    @Req() req: Request,
    @Res() res: Response,
    @Body() reOrderDto: ReOrderDto,
  ) {
    try {
      const { storepkey } = req['user'];
      return this.responseUtil.response(res, 200, '0000', '', {});
    } catch (err) {
      return this.responseUtil.response(res, 500, '9999', '', {});
    }
  }
}
