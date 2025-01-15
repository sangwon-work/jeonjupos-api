import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { ManagerModel } from '../manager.model';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class GetManagerByMidService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly managerModel: ManagerModel,
  ) {}

  private connection: PoolConnection = undefined;

  async getManager(mid: string) {
    try {
      this.connection = await this.databaseService.getDBConnection();

      const managerset = await this.managerModel.getManagerByMid(
        this.connection,
        mid,
      );

      return { managerset };
    } catch (err) {
      throw err;
    } finally {
      if (this.connection !== undefined) {
        this.connection.release();
      }
    }
  }
}
