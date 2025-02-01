import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../shared/database/database.service';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class OrderModel {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * 테이블 주문서 조회
   * @param connection
   * @param storetablepkey
   */
  async getOrderInfoByStoreTable(
    connection: PoolConnection,
    storetablepkey: number,
  ) {
    return await this.databaseService.dbQuery(
      connection,
      `
        select 
            orderinfopkey, orderstatus, ordertype, address, regdate
        from orderinfo
        where storetablepkey=? and orderstatus='DINING'
      `,
      [storetablepkey],
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
            orderinfopkey, orderstatus, ordertype, address, regdate
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
   * @param storetablepkey
   * @param ordertype
   * @param address
   */
  async createOrderInfo(
    connection: PoolConnection,
    storetablepkey: number,
    ordertype: 'INSTORE' | 'TAKEOUT' | 'DELIVERY',
    address: string,
  ) {
    return await this.databaseService.dbQuery(
      connection,
      `
        insert into orderinfo (storetablepkey, orderstatus, ordertype, address, regdate) values (?, 'DINING', ?, ?, now());
      `,
      [storetablepkey, ordertype, address],
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

  /**
   * 테이블 식사여부 상태 변경
   * @param connection
   * @param storetablepkey
   * @param diningyn
   */
  async updateStoreTableDining(
    connection: PoolConnection,
    storetablepkey: number,
    diningyn: 'Y' | 'N',
  ) {
    return await this.databaseService.dbQuery(
      connection,
      `update storetable set diningyn=? where storetablepkey=?`,
      [diningyn, storetablepkey],
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
}
