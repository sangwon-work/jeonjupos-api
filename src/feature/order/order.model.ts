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
            foodname,
            saleprice,
            ordercount
        from orderfood 
        where orderinfopkey=?
        order by orderfoodpkey desc;
      `,
      [orderinfopkey],
    )
  }
}
