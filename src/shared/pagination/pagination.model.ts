import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../core/database/database.service';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class PaginationModel {
  constructor(private readonly databaseService: DatabaseService) {}

  async getList(connection: PoolConnection, sql: string, params: any[]) {
    return await this.databaseService.dbQuery(connection, sql, params);
  }

  async getCount(connection: PoolConnection, sql: string, params: any[]) {
    return await this.databaseService.dbQuery(connection, sql, params);
  }
}
