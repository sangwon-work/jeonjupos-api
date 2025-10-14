import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../shared/database/database.service';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class OrderModel {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * 테이블 주문서 조회
   * @param connection
   * @param diningsessionpkey
   */
  async getOrderInfoByStoreTable(
    connection: PoolConnection,
    diningsessionpkey: number,
  ) {
    return await this.databaseService.dbQuery(
      connection,
      `
        select
          oi.orderinfopkey, 
          orderstatus, 
          servicetype, 
          address, 
          pi.orderprice,
          pi.cardprice,
          pi.cardprice + pi.cashprice + pi.postpayprice payprice,
          oi.regdate
        from orderinfo oi
        join payinfo pi on oi.orderinfopkey=pi.orderinfopkey
        where diningsessionpkey=? and orderstatus='DINING'
      `,
      [diningsessionpkey],
    );
  }

  /**
   * 주문서 조회
   * @param connection
   * @param orderinfopkey
   */
  async getOrderInfoByPkey(connection: PoolConnection, orderinfopkey: number) {
    return await this.databaseService.dbQuery(
      connection,
      `
        select 
            orderinfopkey, orderstatus, servicetype, address, regdate
        from orderinfo
        where orderinfopkey=?
      `,
      [orderinfopkey],
    );
  }

  /**
   * 주문 메뉴 목록 조회
   * @param connection
   * @param orderinfopkey
   */
  async getOrderFoodList(connection: PoolConnection, orderinfopkey: number) {
    return await this.databaseService.dbQuery(
      connection,
      `
        select 
            orderfoodpkey,
            foodpkey,
            foodname,
            saleprice,
            ordercount,
            saleprice * ordercount as totalprice
        from orderfood 
        where orderinfopkey=?
        order by orderfoodpkey desc;
      `,
      [orderinfopkey],
    );
  }

  /**
   * 주문서 생성
   * @param connection
   * @param storepkey
   * @param diningsessionpkey
   * @param servicetype
   * @param ordertype
   * @param address
   */
  async createOrderInfo(
    connection: PoolConnection,
    storepkey: number,
    diningsessionpkey: number | null,
    servicetype: 'DINEIN' | 'TAKEOUT' | 'DELIVERY',
    ordertype: 'PAID' | 'UNPAID' | 'DINING',
    address: string,
  ) {
    return await this.databaseService.dbQuery(
      connection,
      `
        insert into orderinfo (storepkey, diningsessionpkey, orderstatus, servicetype, address, regdate) values (?, ?, ?, ?, ?, now());
      `,
      [storepkey, diningsessionpkey, ordertype, servicetype, address],
    );
  }

  /**
   * 메뉴 조회
   * @param connection
   * @param foodpkey
   */
  async getFood(connection: PoolConnection, foodpkey: number) {
    return await this.databaseService.dbQuery(
      connection,
      `select * from food where foodpkey=?`,
      [foodpkey],
    );
  }

  /**
   * 주무 메뉴 생성
   * @param connection
   * @param orderinfopkey
   * @param food
   * @param ordercount
   */
  async createOrderFood(
    connection: PoolConnection,
    orderinfopkey: number,
    food: any,
    ordercount: number,
  ) {
    return await this.databaseService.dbQuery(
      connection,
      `
        insert into orderfood (
          orderinfopkey, foodpkey, foodname,
          originprice, discountyn, discountamount,
          saleprice, dailystock, stock,
          soldoutyn, showyn, sort,
          ordercount, regdate
        ) values (
          ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?,
          ?, ?, ?,
          ?, now()
        )
      `,
      [
        orderinfopkey,
        food.foodpkey,
        food.foodname,
        food.originprice,
        food.discountyn,
        food.discountamount,
        food.saleprice,
        food.dailystock,
        food.stock,
        food.soldoutyn,
        food.showyn,
        food.sort,
        ordercount,
      ],
    );
  }

  /**
   * 주문메뉴 수량 변경
   * @param connection
   * @param orderfoodpkey
   * @param ordercount
   */
  async updateOrderFoodCount(
    connection: PoolConnection,
    orderfoodpkey: number,
    ordercount: number,
  ) {
    return await this.databaseService.dbQuery(
      connection,
      `update orderfood set ordercount=? where orderfoodpkey=?`,
      [ordercount, orderfoodpkey],
    );
  }

  /**
   * 주문 메뉴 삭제
   * @param connection
   * @param orderfoodpkey
   */
  async deleteOrderFood(connection: PoolConnection, orderfoodpkey: number) {
    return await this.databaseService.dbQuery(
      connection,
      `delete from orderfood where orderfoodpkey=?`,
      [orderfoodpkey],
    );
  }

  async createPayInfo(
    connection: PoolConnection,
    orderinfopkey: number,
    storepkey: number,
    tid: string,
    orderprice: number,
  ) {
    return await this.databaseService.dbQuery(
      connection,
      `
        insert into payinfo (
          orderinfopkey, storepkey, tid,
          paystatus, orderprice, cardprice,
          cashprice, postpayprice, cardcancelableprice,
          cashcancelableprice, postpaycancelableprice,
          regdate
        ) values (
          ?, ?, ?,
          'PENDING', ?, 0,
          0, 0, 0,
          0, 0,
          now()
        )
      `,
      [orderinfopkey, storepkey, tid, orderprice],
    );
  }

  /**
   * 결제정보 주문금액 수정
   * @param connection
   * @param orderinfopkey
   * @param orderprice
   */
  async updatePayInfoOrderPrice(
    connection: PoolConnection,
    orderinfopkey: number,
    orderprice: number,
  ) {
    return await this.databaseService.dbQuery(
      connection,
      `update payinfo set orderprice=? where orderinfopkey=?;`,
      [orderprice, orderinfopkey],
    );
  }

  /**
   * 식사중인 식사 세션 상세 조회
   * @param connection
   * @param storetablepkey
   */
  async getOpenDiningSession(
    connection: PoolConnection,
    storetablepkey: number,
  ) {
    return await this.databaseService.dbQuery(
      connection,
      `select * from diningsession where storetablepkey=? and status='OPEN'`,
      [storetablepkey],
    );
  }
}
