import { Injectable } from '@nestjs/common';
import { GetOrderInfoDto } from '../dto/get-order-info.dto';
import { GetStoreTablePkeyService } from '../../store-table/service/get-store-table-pkey.service';
import { GetOrderInfoByStoreTableService } from '../service/get-order-info-by-store-table.service';
import { StoreTableVo } from '../../store-table/vo/store-table.vo';
import { GetOpenDiningSessionService } from '../service/get-dining-session.service';
import { OrderInfoVo } from '../vo/order-info.vo';

@Injectable()
export class GetOrderInfoFacadeService {
  constructor(
    private readonly getStoreTablePkeyService: GetStoreTablePkeyService,
    private readonly getOrderInfoByStoreTableService: GetOrderInfoByStoreTableService,
    private readonly getOpenDiningSessionService: GetOpenDiningSessionService,
  ) {}

  async getOrderInfo(
    storepkey: number,
    getOrderInfoDto: GetOrderInfoDto,
  ): Promise<{ rescode: string; data: { orderinfo: OrderInfoVo } }> {
    try {
      // 테이블 조회
      const { storetableset } =
        await this.getStoreTablePkeyService.getStoreTable(
          storepkey,
          getOrderInfoDto.storetablepkey,
        );
      if (storetableset.length === 1) {
        const storetable: StoreTableVo = storetableset[0];

        // 식사 중 여부 체크
        const { diningsessionset } =
          await this.getOpenDiningSessionService.getDiningSession(
            storetable.storetablepkey,
          );
        if (diningsessionset.length === 1) {
          // 식사중 테이블
          const diningsession = diningsessionset[0];
          // 주문서 조회
          const { orderinfo } =
            await this.getOrderInfoByStoreTableService.getOrder(
              diningsession.diningsessionpkey,
            );

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
