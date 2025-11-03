import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { PoolConnection } from 'mysql2/promise';
import { PaymentModel } from '../payment.model';

@Injectable()
export class GetPayInfoService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paymentModel: PaymentModel,
  ) {}

  /**
   * 주문서 조회
   * @param orderinfopkey
   */
  async getPayInfo(orderinfopkey: number) {
    let connection: PoolConnection | null = null;

    try {
      connection = await this.databaseService.getDBConnection();

      const payinfoset = await this.paymentModel.getPayInfo(
        connection,
        orderinfopkey,
      );

      return { payinfoset: payinfoset };
    } catch (err) {
      throw err;
    } finally {
      connection?.release();
    }
  }
}
