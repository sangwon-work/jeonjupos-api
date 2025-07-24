import { Injectable } from '@nestjs/common';
import { GetOrderInfoDto } from '../dto/get-order-info.dto';
import { GetStoreTablePkeyService } from '../../store-table/service/get-store-table-pkey.service';
import { GetOrderInfoByStoreTableService } from '../service/get-order-info-by-store-table.service';

@Injectable()
export class GetOrderInfoFacadeService {
  constructor(
    private readonly getStoreTablePkeyService: GetStoreTablePkeyService,
    private readonly getOrderInfoByStoreTableService: GetOrderInfoByStoreTableService,
  ) {}

  async getOrderInfo(
    storepkey: number,
    getOrderInfoDto: GetOrderInfoDto,
  ): Promise<{ rescode: string; data: { orderinfo: null | any } }> {
    try {
      // 테이블 조회
      const { storetableset } =
        await this.getStoreTablePkeyService.getStoreTable(
          storepkey,
          getOrderInfoDto.storetablepkey,
        );
      if (storetableset.length === 1) {
        const storetable = storetableset[0];
        if (storetable.diningyn === 'Y') {
          // 식사중 테이블
          const { orderinfo } =
            await this.getOrderInfoByStoreTableService.getOrder(
              storetable.storetablepkey,
            ); // 주문서 조회
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
