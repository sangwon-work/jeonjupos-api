import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../core/database/database.service';
import { OrderModel } from '../order.model';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class GetOrderFoodListService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly orderModel: OrderModel,
  ) {}

  /**
   * 주문 메뉴내역 조회
   * @param orderinfopkey
   */
  async getList(orderinfopkey: number) {
    let connection: PoolConnection | null = null;

    try {
      connection = await this.databaseService.getDBConnection();
      const orderfoodlist = await this.orderModel.getOrderFoodList(
        connection,
        orderinfopkey,
      );

      let totalordercount = 0;
      let totalprice = 0;
      for (const orderfood of orderfoodlist) {
        totalordercount += orderfood.ordercount;
        totalprice += orderfood.saleprice * orderfood.ordercount;
      }

      return {
        orderfoodlist: orderfoodlist,
        totalordercount: totalordercount,
        totalprice: totalprice,
      };
    } catch (err) {
      throw err;
    } finally {
      connection?.release();
    }
  }
}
