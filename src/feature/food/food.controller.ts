import {
  Controller,
  Get,
  Request,
  Response,
  Req,
  Res,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ResponseUtil } from '../../shared/response/response.util';
import { AuthGuard } from '@nestjs/passport';
import { GetFoodCategoryListFacadeService } from './facade/get-food-category-list-facade.service';
import { GetFoodListDto } from './dto/get-food-list.dto';
import { GetFoodListFacadeService } from './facade/get-food-list-facade.service';

@Controller('food')
export class FoodController {
  constructor(
    private readonly responseUtil: ResponseUtil,
    private readonly getFoodCategoryListFacadeService: GetFoodCategoryListFacadeService,
    private readonly getFoodListFacadeService: GetFoodListFacadeService,
  ) {}

  @Get('/category/list')
  @UseGuards(AuthGuard('access'))
  async getFoodCategoryList(@Req() req: Request, @Res() res: Response) {
    try {
      const { storepkey } = req['user'];

      const { data } = await this.getFoodCategoryListFacadeService.getList(
        storepkey,
      );
      return this.responseUtil.response(res, 200, '0000', '', data);
    } catch (err) {
      return this.responseUtil.response(res, 500, '9999', '', {});
    }
  }

  @Get('/list')
  @UseGuards(AuthGuard('access'))
  async getFoodList(
    @Req() req: Request,
    @Res() res: Response,
    @Query() getFoodListDto: GetFoodListDto,
  ) {
    try {
      const { storepkey } = req['user'];

      const { data } = await this.getFoodListFacadeService.getList(
        getFoodListDto,
      );
      return this.responseUtil.response(res, 200, '0000', '', data);
    } catch (err) {
      return this.responseUtil.response(res, 500, '9999', '', {});
    }
  }
}
