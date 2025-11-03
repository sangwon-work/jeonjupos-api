// database.service.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mysql from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../configuration/configuration.interface';
import { Pool, PoolConnection } from 'mysql2/promise';

@Injectable()
export class DatabaseService implements OnModuleInit {
  public CP: Pool; // connection pool
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const database =
      this.configService.get<Configuration['database']>('database');

    this.CP = mysql.createPool({
      host: database.host,
      user: database.user,
      password: database.password,
      port: database.port,
      database: database.database,
      connectionLimit: database.connectionLimit,
      charset: 'utf8mb4',
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    });

    console.log(`✅ START CONNECTION 🚀 `);
  }

  /**
   * connection 가져오기
   */
  async getDBConnection(): Promise<PoolConnection> {
    try {
      return await this.CP.getConnection();
    } catch (err) {
      throw err;
    }
  }

  /**
   * 쿼리 보내기
   * @param connection
   * @param sql
   * @param params
   */
  async dbQuery(
    connection: PoolConnection,
    sql: string,
    params: any[],
  ): Promise<any> {
    try {
      const querySet = await connection.query(sql, params);

      return querySet[0];
    } catch (err) {
      err.name = 'DBError';
      throw err;
    }
  }
}
