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

  private connection: PoolConnection = undefined;

  /**
   * 주문서 조회
   * @param orderinfopkey
   */
  async getPayInfo(orderinfopkey: number) {
    try {
      this.connection = await this.databaseService.getDBConnection();

      const payinfoset = await this.paymentModel.getPayInfo(
        this.connection,
        orderinfopkey,
      );

      return { payinfoset: payinfoset };
    } catch (err) {
      throw err;
    } finally {
      if (this.connection !== undefined) {
        this.connection.release();
      }
    }
  }
}
