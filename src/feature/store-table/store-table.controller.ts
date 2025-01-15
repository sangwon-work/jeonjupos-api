import {
  Controller,
  Req,
  Res,
  Request,
  Response,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseUtil } from '../../shared/response/response.util';
import { GetStoreTableListFacadeService } from './facade/get-store-table-list-facade.service';

@Controller('store-table')
export class StoreTableController {
  constructor(
    private readonly responseUtil: ResponseUtil,
    private readonly getStoreTableListFacadeService: GetStoreTableListFacadeService,
  ) {}

  @Get('/list')
  @UseGuards(AuthGuard('access'))
  async getList(@Req() req: Request, @Res() res: Response) {
    try {
      const { storepkey } = req['user'];

      const { data } =
        await this.getStoreTableListFacadeService.getStoreTableList(storepkey);
      return this.responseUtil.response(res, 200, '0000', '', data);
    } catch (err) {
      return this.responseUtil.response(res, 500, '9999', '', {});
    }
  }
}
