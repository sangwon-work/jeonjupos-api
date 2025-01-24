import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../shared/database/database.service';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class StoreTableModel {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * 매장별
   * 매장식사 전용 테이블 목록 조회
   * @param connection
   * @param storepkey
   */
  async getInStoreTableList(connection: PoolConnection, storepkey: number) {
    return await this.databaseService.dbQuery(
      connection,
      `
        select 
            storetablepkey, tabletype, tablenumber, diningyn 
        from storetable where storepkey=? and tabletype='INSTORE' and useyn='Y'`,
      [storepkey],
    );
  }

  /**
   * 테이블 상세 조회
   * @param connection
   * @param storepkey
   * @param storetablepkey
   */
  async getStoreTable(
    connection: PoolConnection,
    storepkey: number,
    storetablepkey: number,
  ) {
    return await this.databaseService.dbQuery(
      connection,
      `
        select 
            storetablepkey, tabletype, tablenumber, diningyn 
        from storetable where storepkey=? and storetablepkey=? and useyn='Y'`,
      [storepkey, storetablepkey],
    );
  }

  /**
   * 테이블 주문내역 조회
   * @param connection
   * @param storetablepkey
   */
  async getStoreTableOrderList(
    connection: PoolConnection,
    storetablepkey: number,
  ) {
    return await this.databaseService.dbQuery(
      connection,
      `
        select 
            oi.orderinfopkey,
            oi.orderstatus,
            oi.ordertype,
            oi.address,
            oi.regdate,
            f.foodname,
            f.saleprice,
            f.ordercount
        from orderinfo oi
        join orderfood f on oi.orderinfopkey=f.orderinfopkey
        where oi.storetablepkey=? and oi.orderstatus='DINING'
      `,
      [storetablepkey],
    );
  }
}
