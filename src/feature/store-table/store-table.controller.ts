import { Controller, Req, Request, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetStoreTableListFacadeService } from './facade/get-store-table-list-facade.service';
import { respond } from '../../shared/utils/response/response';

@Controller('store-table')
export class StoreTableController {
  constructor(
    private readonly getStoreTableListFacadeService: GetStoreTableListFacadeService,
  ) {}

  @Get('/list')
  @UseGuards(AuthGuard('access'))
  async getList(@Req() req: Request) {
    const { storepkey } = req['user'];
    const { data } =
      await this.getStoreTableListFacadeService.getStoreTableList(storepkey);
    return respond('0000', '', data);
  }
}
