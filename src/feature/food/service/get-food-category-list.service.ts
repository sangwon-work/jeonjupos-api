import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../core/database/database.service';
import { FoodModel } from '../food.model';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class GetFoodCategoryListService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly foodModel: FoodModel,
  ) {}

  /**
   * 메뉴 카테고리 목록 조회
   * @param storepkey
   */
  async getList(storepkey: number) {
    let connection: PoolConnection | null = null;

    try {
      connection = await this.databaseService.getDBConnection();

      const foodcategoryset = await this.foodModel.getFoodCategoryList(
        connection,
        storepkey,
      );

      return { foodcategoryset };
    } catch (err) {
      throw err;
    } finally {
      connection?.release();
    }
  }
}
