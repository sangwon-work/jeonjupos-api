import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { OrderModel } from '../order.model';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class GetOrderInfoByPkeyService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly orderModel: OrderModel,
  ) {}

  /**
   * 주문서 조회
   * @param orderinfopkey
   */
  async getOrder(orderinfopkey: number) {
    let connection: PoolConnection | null = null;

    try {
      connection = await this.databaseService.getDBConnection();
      // 주문서 조회
      const orderinfoset = await this.orderModel.getOrderInfoByPkey(
        connection,
        orderinfopkey,
      );

      return { orderinfoset: orderinfoset };
    } catch (err) {
      throw err;
    } finally {
      connection?.release();
    }
  }
}
