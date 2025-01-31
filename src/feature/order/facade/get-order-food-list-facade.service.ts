import { Injectable } from '@nestjs/common';
import { GetOrderFoodListService } from '../service/get-order-food-list.service';
import { GetOrderListDto } from '../dto/get-order-list.dto';

@Injectable()
export class GetOrderFoodListFacadeService {
  constructor(
    private readonly getOrderFoodListService: GetOrderFoodListService,
  ) {}

  async getOrderList(getOrderListDto: GetOrderListDto) {
    try {
      const { orderfoodlist, totalordercount, totalprice } =
        await this.getOrderFoodListService.getList(
          getOrderListDto.orderinfopkey,
        );

      return { data: { orderfoodlist, totalordercount, totalprice } };
    } catch (err) {
      throw err;
    }
  }
}
