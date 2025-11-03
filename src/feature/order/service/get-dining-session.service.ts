import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { OrderModel } from '../order.model';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class GetOpenDiningSessionService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly orderModel: OrderModel,
  ) {}

  async getDiningSession(storetablepkey: number) {
    let connection: PoolConnection | null = null;

    try {
      connection = await this.databaseService.getDBConnection();

      const diningsessionset = await this.orderModel.getOpenDiningSession(
        connection,
        storetablepkey,
      );

      return { diningsessionset: diningsessionset };
    } catch (err) {
      await connection?.rollback();
      throw err;
    } finally {
      connection?.release();
    }
  }
}
