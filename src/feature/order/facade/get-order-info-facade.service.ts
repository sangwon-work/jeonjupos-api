import { Injectable } from '@nestjs/common';
import { GetOrderListDto } from '../dto/get-order-list.dto';
import { GetStoreTablePkeyService } from '../../store-table/service/get-store-table-pkey.service';
import { GetOrderListService } from '../service/get-order-list.service';

@Injectable()
export class GetOrderInfoFacadeService {
  constructor(
    private readonly getStoreTablePkeyService: GetStoreTablePkeyService,
    private readonly getOrderListService: GetOrderListService,
  ) {}

  async getOrderInfo(
    storepkey: number,
    getOrderListDto: GetOrderListDto,
  ): Promise<{ rescode: string; data: { orderinfo: null | any } }> {
    try {
      // 테이블 조회
      const { storetableset } =
        await this.getStoreTablePkeyService.getStoreTable(
          storepkey,
          getOrderListDto.storetablepkey,
        );
      if (storetableset.length === 1) {
        const storetable = storetableset[0];
        if (storetable.diningyn === 'Y') {
          // 식사중 테이블
          const { orderinfo } = await this.getOrderListService.getOrderList(
            storetable.storetablepkey,
          ); // 주문내역 조회
          return { rescode: '0000', data: { orderinfo: orderinfo } };
        } else {
          // 공석 테이블 주문내역 없음
          return { rescode: '0000', data: { orderinfo: null } };
        }
      } else {
        // 테이블을 찾을 수 없습니다.
        return { rescode: '0002', data: { orderinfo: null } };
      }
    } catch (err) {
      throw err;
    }
  }
}
