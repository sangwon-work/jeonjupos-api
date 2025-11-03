import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../core/database/database.service';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class PaymentModel {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * 결제정보 조회
   * @param connection
   * @param orderinfopkey
   */
  async getPayInfo(connection: PoolConnection, orderinfopkey: number) {
    return await this.databaseService.dbQuery(
      connection,
      `
        select *
        from orderinfo oi
        join payinfo pi on oi.orderinfopkey=pi.orderinfopkey
        where oi.orderinfopkey=?
      `,
      [orderinfopkey],
    );
  }

  /**
   * 결재내역 저장
   * @param connection
   * @param payinfopkey
   * @param payamount
   * @param paytype
   */
  async createPay(
    connection: PoolConnection,
    payinfopkey: number,
    payamount: number,
    paytype: 'CASH' | 'CARD' | 'POSTPAY',
  ) {
    const from = paytype === 'CASH' ? 'cashpay' : 'cardpay';
    return await this.databaseService.dbQuery(
      connection,
      `insert into ${from} (payinfopkey, paystatus, payamount, cancelpayamount, cancelableamount, regdate) values (?, 'APPROVED', ?, ?, ?, now())`,
      [payinfopkey, payamount, 0, payamount],
    );
  }

  /**
   * 결제정보 결제 상태 변경
   * @param connection
   * @param payinfopkey
   * @param paystatus
   * @param payamount
   * @param paytype
   */
  async updatePayInfo(
    connection: PoolConnection,
    payinfopkey: number,
    paystatus: string,
    payamount: number,
    paytype: 'CASH' | 'CARD' | 'POSTPAY',
  ) {
    let set = ``;
    const params = [paystatus, payamount, payamount];
    if (paytype === 'CASH') {
      set += ` cashprice=cashprice+?, cashcancelableprice=cashcancelableprice+?`;
    } else if (paytype === 'CARD') {
      set += ` cardprice=cardprice+?, cardcancelableprice=cardcancelableprice+?`;
    } else {
      set += ` postpayprice=postpayprice+?, postpaycancelableprice=postpaycancelableprice+?`;
    }

    params.push(payinfopkey);
    return await this.databaseService.dbQuery(
      connection,
      `
        update payinfo set paystatus=?, ${set} where payinfopkey=?
      `,
      params,
    );
  }

  /**
   * 주문서 결제완료 상태로 변경
   * @param connection
   * @param orderinfopkey
   */
  async updateOrderInfoStatus(
    connection: PoolConnection,
    orderinfopkey: number,
  ) {
    return await this.databaseService.dbQuery(
      connection,
      `update orderinfo set orderstatus='PAID' where orderinfopkey=?`,
      [orderinfopkey],
    );
  }

  /**
   * 매장 테이블 식사여부 변경
   * @param connection
   * @param orderinfopkey
   */
  async updateStoreTableDining(
    connection: PoolConnection,
    orderinfopkey: number,
  ) {
    return await this.databaseService.dbQuery(
      connection,
      `update orderinfo oi join diningsession ds on oi.diningsessionpkey=ds.diningsessionpkey set ds.status='CLOSED' where oi.orderinfopkey=?`,
      [orderinfopkey],
    );
  }
}
