import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../core/database/database.service';
import { PaymentModel } from '../payment.model';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class PaymentService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly paymentModel: PaymentModel,
  ) {}

  async createPayment(
    payinfo: any,
    paytype: 'CASH' | 'CARD' | 'POSTPAY',
    payamount: number,
  ): Promise<{ rescode: '0000' | '0006' | '0007' }> {
    let connection: PoolConnection | null = null;

    try {
      connection = await this.databaseService.getDBConnection();
      await connection.beginTransaction();

      // 받을 금액 (주문금액 - (카드 결제금액 + 현금 결제금액 + 후불결제금액))
      const pendingamount: number =
        payinfo.orderprice -
        (payinfo.cardprice + payinfo.cashprice + payinfo.postpayprice);

      if (pendingamount < payamount) {
        // 결제금액이 맞지 않습니다.
        await connection.rollback();
        return { rescode: '0006' };
      } else if (pendingamount === payamount) {
        // 결제완료

        // 결제내역 저장
        await this.paymentModel.createPay(
          connection,
          payinfo.payinfopkey,
          payamount,
          paytype,
        );
        // 결제상태 수정, 결제수단별 금액 변경, 결제수단별 취소가능금액 변경
        await this.paymentModel.updatePayInfo(
          connection,
          payinfo.payinfopkey,
          'COMPLETE',
          payamount,
          paytype,
        );

        // 주문서 결제완료 상태로 변경
        await this.paymentModel.updateOrderInfoStatus(
          connection,
          payinfo.orderinfopkey,
        );
        // 매장 테이블 식사여부 공석 상태로 변경
        await this.paymentModel.updateStoreTableDining(
          connection,
          payinfo.orderinfopkey,
        );
        await connection.commit();
        return { rescode: '0000' };
      } else {
        // 부분결제

        // 결제내역 저장
        await this.paymentModel.createPay(
          connection,
          payinfo.payinfopkey,
          payamount,
          paytype,
        );
        // 결제상태 수정, 결제수단별 금액 변경, 결제수단별 취소가능금액 변경
        await this.paymentModel.updatePayInfo(
          connection,
          payinfo.payinfopkey,
          'PARTIALCOMPLETE',
          payamount,
          paytype,
        );
        await connection.commit();
        return { rescode: '0007' };
      }
    } catch (err) {
      await connection?.rollback();
      throw err;
    } finally {
      connection?.release();
    }
  }
}
