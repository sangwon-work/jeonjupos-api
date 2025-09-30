import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { ManagerModel } from '../manager.model';
import { PoolConnection } from 'mysql2/promise';
import { ManagerVo } from '../vo/manager.vo';

@Injectable()
export class GetManagerByMidService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly managerModel: ManagerModel,
  ) {}

  async getManager(mid: string): Promise<{ managerset: ManagerVo[] }> {
    let connection: PoolConnection | null = null;

    try {
      connection = await this.databaseService.getDBConnection();

      const managerset: ManagerVo[] = await this.managerModel.getManagerByMid(
        connection,
        mid,
      );

      return { managerset };
    } catch (err) {
      throw err;
    } finally {
      connection?.release();
    }
  }
}
