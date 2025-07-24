import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { StoreTableModel } from '../store-table.model';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class GetStoreTableByInStoreService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly storeTableModel: StoreTableModel,
  ) {}

  /**
   * 매장별
   * 매장식사 전용 테이블 목록 조회
   * @param storepkey
   */
  async getStoreTableList(storepkey: number) {
    let connection: PoolConnection | null = null;

    try {
      connection = await this.databaseService.getDBConnection();

      const storetableset = await this.storeTableModel.getInStoreTableList(
        connection,
        storepkey,
      );

      return { storetableset };
    } catch (err) {
      throw err;
    } finally {
      connection?.release();
    }
  }
}
