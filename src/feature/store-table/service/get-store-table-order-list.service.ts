import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { StoreTableModel } from '../store-table.model';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class GetStoreTableOrderListService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly storeTableModel: StoreTableModel,
  ) {}

  private connection: PoolConnection = undefined;

  /**
   * 테이블 주문내역 조회
   * @param storetablepkey
   */
  async getOrderList(storetablepkey: number) {
    try {
      this.connection = await this.databaseService.getDBConnection();

      const orderset = await this.storeTableModel.getStoreTableOrderList(
        this.connection,
        storetablepkey,
      );

      return { orderset };
    } catch (err) {
      throw err;
    } finally {
      if (this.connection !== undefined) {
        this.connection.release();
      }
    }
  }
}
