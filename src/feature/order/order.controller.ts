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
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetOrderInfoDto } from './dto/get-order-info.dto';
import { GetOrderInfoFacadeService } from './facade/get-order-info-facade.service';
import { FirstOrderDto } from './dto/first-order.dto';
import { ReOrderDto } from './dto/re-order.dto';
import { GetOrderListDto } from './dto/get-order-list.dto';
import { GetOrderFoodListFacadeService } from './facade/get-order-food-list-facade.service';
import { FirstOrderFacadeService } from './facade/first-order-facade.service';
import { ReOrderFacadeService } from './facade/re-order-facade.service';
import { respond } from '../../shared/utils/response/response';

@Controller('order')
export class OrderController {
  constructor(
    private readonly getOrderInfoFacadeService: GetOrderInfoFacadeService,
    private readonly getOrderFoodListFacadeService: GetOrderFoodListFacadeService,
    private readonly firstOrderFacadeService: FirstOrderFacadeService,
    private readonly reOrderFacadeService: ReOrderFacadeService,
  ) {}

  /**
   * 주문 정보 조회
   * @param req
   * @param res
   * @param getOrderInfoDto
   */
  @Get('/info')
  @UseGuards(AuthGuard('access'))
  async getOrderInfo(
    @Req() req: Request,
    @Res() res: Response,
    @Query() getOrderInfoDto: GetOrderInfoDto,
  ) {
    const { storepkey } = req['user'];
    const { rescode, data } = await this.getOrderInfoFacadeService.getOrderInfo(
      storepkey,
      getOrderInfoDto,
    );
    return respond(rescode, '', data);
  }

  /**
   * 주문 메뉴 목록 조회
   * @param req
   * @param res
   * @param getOrderListDto
   */
  @Get('/food/list')
  @UseGuards(AuthGuard('access'))
  async getList(
    @Req() req: Request,
    @Res() res: Response,
    @Query() getOrderListDto: GetOrderListDto,
  ) {
    const { data } = await this.getOrderFoodListFacadeService.getOrderList(
      getOrderListDto,
    );
    return respond('0000', '', data);
  }

  /**
   * 첫주문
   * @param req
   * @param res
   * @param firstOrderDto
   */
  @Post('/first')
  @HttpCode(200)
  @UseGuards(AuthGuard('access'))
  async firstOrder(
    @Req() req: Request,
    @Res() res: Response,
    @Body() firstOrderDto: FirstOrderDto,
  ) {
    const { storepkey } = req['user'];
    const { rescode } = await this.firstOrderFacadeService.firstOrder(
      storepkey,
      firstOrderDto,
    );
    return respond(rescode, '', {});
  }

  /**
   * 재주문
   * @param reOrderDto
   */
  @Post('/re')
  @HttpCode(200)
  @UseGuards(AuthGuard('access'))
  async reOrder(@Body() reOrderDto: ReOrderDto) {
    const { rescode } = await this.reOrderFacadeService.reOrder(reOrderDto);
    return respond(rescode, '', {});
  }
}
