import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { StoreTableModel } from '../store-table.model';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class GetStoreTablePkeyService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly storeTableModel: StoreTableModel,
  ) {}

  private connection: PoolConnection = undefined;

  /**
   * 매장 테이블 상세 조회
   * @param storepkey
   * @param storetablepkey
   */
  async getStoreTable(storepkey: number, storetablepkey: number) {
    try {
      this.connection = await this.databaseService.getDBConnection();

      const storetableset = await this.storeTableModel.getStoreTable(
        this.connection,
        storepkey,
        storetablepkey,
      );

      return { storetableset };
    } catch (err) {
      throw err;
    } finally {
      if (this.connection !== undefined) {
        this.connection.release();
      }
    }
  }
}
