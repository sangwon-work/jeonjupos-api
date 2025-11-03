import { Injectable } from '@nestjs/common';
import { GetFoodListService } from '../service/get-food-list.service';
import { GetFoodListDto } from '../dto/get-food-list.dto';

@Injectable()
export class GetFoodListFacadeService {
  constructor(private readonly getFoodListService: GetFoodListService) {}

  async getList(getFoodListDto: GetFoodListDto) {
    const { foodset } = await this.getFoodListService.getList(
      getFoodListDto.foodcategorypkey,
    );

    return { data: { foodlist: foodset } };
  }
}
