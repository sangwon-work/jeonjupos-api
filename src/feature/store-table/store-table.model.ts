import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../core/database/database.service';
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
            storetablepkey, label, colstart, colend, rowstart, rowend
        from storetable where storepkey=? and useyn='Y'`,
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
            storetablepkey, label 
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
            oi.regdate,
            f.foodname,
            f.saleprice,
            f.ordercount
        from diningsession ds
        join orderinfo oi on ds.diningsessionpkey=oi.diningsessionpkey
        join orderfood f on oi.orderinfopkey=f.orderinfopkey
        where ds.storetablepkey=? and ds.status='OPEN' and oi.servicetype='DINEIN'
      `,
      [storetablepkey],
    );
  }
}
