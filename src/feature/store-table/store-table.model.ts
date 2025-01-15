import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../shared/database/database.service';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class StoreTableModel {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * 매장별
   * 매장식사 전용 테이블 목록 조회
   * @param connection
   * @param storepkey
   */
  async getInStoreTableList(connection: PoolConnection, storepkey: number) {
    return await this.databaseService.dbQuery(
      connection,
      `select storetablepkey, tablenumber, diningyn from storetable where storepkey=? and tabletype='INSTORE' and useyn='Y'`,
      [storepkey],
    );
  }
}
