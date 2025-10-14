import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { StoreTableModel } from '../store-table.model';
import { PoolConnection } from 'mysql2/promise';
import { StoreTableVo } from '../vo/store-table.vo';

@Injectable()
export class GetStoreTablePkeyService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly storeTableModel: StoreTableModel,
  ) {}

  /**
   * 매장 테이블 상세 조회
   * @param storepkey
   * @param storetablepkey
   */
  async getStoreTable(
    storepkey: number,
    storetablepkey: number,
  ): Promise<{ storetableset: StoreTableVo[] }> {
    let connection: PoolConnection | null = null;

    try {
      connection = await this.databaseService.getDBConnection();

      const storetableset: StoreTableVo[] =
        await this.storeTableModel.getStoreTable(
          connection,
          storepkey,
          storetablepkey,
        );

      return { storetableset };
    } catch (err) {
      throw err;
    } finally {
      connection?.release();
    }
  }
}
