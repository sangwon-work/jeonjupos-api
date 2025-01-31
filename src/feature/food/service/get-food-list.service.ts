import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { FoodModel } from '../food.model';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class GetFoodListService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly foodModel: FoodModel,
  ) {}

  private connection: PoolConnection = undefined;

  /**
   * 메뉴 목록 조회
   * @param foodcategorypkey
   */
  async getList(foodcategorypkey: number) {
    try {
      this.connection = await this.databaseService.getDBConnection();

      const foodset = await this.foodModel.getFoodList(
        this.connection,
        foodcategorypkey,
      );

      return { foodset };
    } catch (err) {
      throw err;
    } finally {
      if (this.connection !== undefined) {
        this.connection.release();
      }
    }
  }
}
