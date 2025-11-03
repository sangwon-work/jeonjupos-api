import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../core/database/database.service';
import { OrderModel } from '../order.model';
import { PoolConnection } from 'mysql2/promise';
import { OrderInfoVo } from '../vo/order-info.vo';

@Injectable()
export class GetOrderInfoByStoreTableService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly orderModel: OrderModel,
  ) {}

  /**
   * 주문내역 조회
   * @param diningsessionpkey
   */
  async getOrder(
    diningsessionpkey: number,
  ): Promise<{ orderinfo: OrderInfoVo }> {
    let connection: PoolConnection | null = null;

    try {
      connection = await this.databaseService.getDBConnection();
      // 주문서 조회
      const orderinfoset: OrderInfoVo[] =
        await this.orderModel.getOrderInfoByStoreTable(
          connection,
          diningsessionpkey,
        );

      if (orderinfoset.length === 1) {
        const orderinfo: OrderInfoVo = orderinfoset[0];
        return { orderinfo: orderinfo };
      } else {
        return { orderinfo: null };
      }
    } catch (err) {
      throw err;
    } finally {
      connection?.release();
    }
  }
}
