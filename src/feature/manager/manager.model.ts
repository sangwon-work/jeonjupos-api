import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../shared/database/database.service';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class ManagerModel {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * mid로 관리자 조회
   * @param connection
   * @param mid
   */
  async getManagerByMid(connection: PoolConnection, mid: string) {
    return await this.databaseService.dbQuery(
      connection,
      `select * from manager where mid=?;`,
      [mid],
    );
  }
}
