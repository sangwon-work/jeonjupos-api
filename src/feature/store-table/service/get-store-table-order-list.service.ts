import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { StoreTableModel } from '../store-table.model';
import { PoolConnection } from 'mysql2/promise';
import { StoreTableOrderListVo } from '../vo/store-table-order-list.vo';

@Injectable()
export class GetStoreTableOrderListService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly storeTableModel: StoreTableModel,
  ) {}

  /**
   * 테이블 주문내역 조회
   * @param storetablepkey
   */
  async getOrderList(
    storetablepkey: number,
  ): Promise<{ orderset: StoreTableOrderListVo[] }> {
    let connection: PoolConnection | null = null;

    try {
      connection = await this.databaseService.getDBConnection();

      const orderset: StoreTableOrderListVo[] =
        await this.storeTableModel.getStoreTableOrderList(
          connection,
          storetablepkey,
        );

      return { orderset };
    } catch (err) {
      throw err;
    } finally {
      connection?.release();
    }
  }
}
