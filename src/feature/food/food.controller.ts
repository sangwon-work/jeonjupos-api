import {
  Controller,
  Get,
  Request,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetFoodCategoryListFacadeService } from './facade/get-food-category-list-facade.service';
import { GetFoodListDto } from './dto/get-food-list.dto';
import { GetFoodListFacadeService } from './facade/get-food-list-facade.service';
import { respond } from '../../shared/utils/response/response';

@Controller('food')
export class FoodController {
  constructor(
    private readonly getFoodCategoryListFacadeService: GetFoodCategoryListFacadeService,
    private readonly getFoodListFacadeService: GetFoodListFacadeService,
  ) {}

  @Get('/category/list')
  @UseGuards(AuthGuard('access'))
  async getFoodCategoryList(@Req() req: Request) {
    const { storepkey } = req['user'];

    const { data } = await this.getFoodCategoryListFacadeService.getList(
      storepkey,
    );
    return respond('0000', '', data);
  }

  @Get('/list')
  @UseGuards(AuthGuard('access'))
  async getFoodList(@Query() getFoodListDto: GetFoodListDto) {
    const { data } = await this.getFoodListFacadeService.getList(
      getFoodListDto,
    );
    return respond('0000', '', data);
  }
}
