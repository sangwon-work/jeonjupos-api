import { Injectable } from '@nestjs/common';
import { ReOrderDto } from '../dto/re-order.dto';
import { GetOrderInfoByPkeyService } from '../service/get-order-info-by-pkey.service';
import { ReOrderService } from '../service/re-order.service';

@Injectable()
export class ReOrderFacadeService {
  constructor(
    private readonly getOrderInfoByPkeyService: GetOrderInfoByPkeyService,
    private readonly reOrderService: ReOrderService,
  ) {}

  async reOrder(reOrderDto: ReOrderDto) {
    try {
      const { orderinfoset } = await this.getOrderInfoByPkeyService.getOrder(
        reOrderDto.orderinfopkey,
      );
      if (orderinfoset.length === 1) {
        // 주문 메뉴 추가 및 수정
        const { rescode } = await this.reOrderService.reOrder(reOrderDto);
        return { rescode: rescode };
      } else {
        // 주문서를 찾을 수 없습니다.
        return { rescode: '0004' };
      }
    } catch (err) {
      throw err;
    }
  }
}
