import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { OrderModel } from '../order.model';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class GetOrderInfoByStoreTableService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly orderModel: OrderModel,
  ) {}

  private connection: PoolConnection = undefined;

  /**
   * 주문내역 조회
   * @param storetablepkey
   */
  async getOrder(storetablepkey: number) {
    try {
      this.connection = await this.databaseService.getDBConnection();
      // 주문서 조회
      const orderinfoset = await this.orderModel.getOrderInfoByStoreTable(
        this.connection,
        storetablepkey,
      );

      if (orderinfoset.length === 1) {
        const orderinfo = orderinfoset[0];
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
