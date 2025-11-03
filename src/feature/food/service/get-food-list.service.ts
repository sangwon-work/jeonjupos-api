import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../core/database/database.service';
import { FoodModel } from '../food.model';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class GetFoodListService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly foodModel: FoodModel,
  ) {}

  /**
   * 메뉴 목록 조회
   * @param foodcategorypkey
   */
  async getList(foodcategorypkey: number) {
    let connection: PoolConnection | null = null;

    try {
      connection = await this.databaseService.getDBConnection();

      const foodset = await this.foodModel.getFoodList(
        connection,
        foodcategorypkey,
      );

      return { foodset };
    } catch (err) {
      throw err;
    } finally {
      connection?.release();
    }
  }
}
