import { Injectable } from '@nestjs/common';
import { GetFoodCategoryListService } from '../service/get-food-category-list.service';

@Injectable()
export class GetFoodCategoryListFacadeService {
  constructor(
    private readonly getFoodCategoryListService: GetFoodCategoryListService,
  ) {}

  async getList(storepkey: number) {
    try {
      const { foodcategoryset } = await this.getFoodCategoryListService.getList(
        storepkey,
      );

      return { data: { foodcategorylist: foodcategoryset } };
    } catch (err) {
      throw err;
    }
  }
}
