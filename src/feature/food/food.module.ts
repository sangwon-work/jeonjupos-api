import { Module } from '@nestjs/common';
import { FoodController } from './food.controller';
import { FoodModel } from './food.model';
import { GetFoodCategoryListService } from './service/get-food-category-list.service';
import { GetFoodCategoryListFacadeService } from './facade/get-food-category-list-facade.service';
import { GetFoodListFacadeService } from './facade/get-food-list-facade.service';
import { GetFoodListService } from './service/get-food-list.service';

@Module({
  controllers: [FoodController],
  providers: [
    FoodModel,
    GetFoodCategoryListService,
    GetFoodCategoryListFacadeService,
    GetFoodListFacadeService,
    GetFoodListService,
  ],
})
export class FoodModule {}
