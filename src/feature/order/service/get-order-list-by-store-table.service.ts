import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { OrderModel } from '../order.model';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class GetOrderListByStoreTableService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly orderModel: OrderModel,
  ) {}

  private connection: PoolConnection = undefined;

  /**
   * 주문내역 조회
   * @param storetablepkey
   */
  async getOrderList(storetablepkey: number) {
    try {
      this.connection = await this.databaseService.getDBConnection();
      // 주문서 조회
      const orderinfoset = await this.orderModel.getOrderInfoByStoreTable(
        this.connection,
        storetablepkey,
      );

      if (orderinfoset.length === 1) {
        const orderinfo = orderinfoset[0];
        // 주문 메뉴 목록 조회
        orderinfo.orderfoodlist = await this.orderModel.getOrderFoodList(
          this.connection,
          orderinfo.orderinfopkey,
        );
        return { orderinfo: orderinfo };
      } else {
        return { orderinfo: null };
      }
    } catch (err) {
      throw err;
    } finally {
      if (this.connection !== undefined) {
        this.connection.release();
      }
    }
  }
}
