import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../shared/database/database.service';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class FoodModel {
  constructor(private readonly databaseService: DatabaseService) {}

  /**
   * 메뉴 카테고리 목록 조회
   * @param connection
   * @param storepkey
   */
  async getFoodCategoryList(connection: PoolConnection, storepkey: number) {
    return await this.databaseService.dbQuery(
      connection,
      `select foodcategorypkey, foodcategoryname from foodcategory where storepkey=? and useyn='Y' order by sort, foodcategorypkey`,
      [storepkey],
    );
  }

  /**
   * 메뉴 카테고리별 메뉴 목록 조회
   * @param connection
   * @param foodcategorypkey
   */
  async getFoodList(connection: PoolConnection, foodcategorypkey: number) {
    return await this.databaseService.dbQuery(
      connection,
      `select foodpkey, foodname, saleprice, stock, soldoutyn from food where foodcategorypkey=? and showyn='Y' order by sort`,
      [foodcategorypkey],
    );
  }
}
