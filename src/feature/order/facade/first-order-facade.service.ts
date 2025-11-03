import { Injectable } from '@nestjs/common';
import { FirstOrderDto } from '../dto/first-order.dto';
import { GetStoreTablePkeyService } from '../../store-table/service/get-store-table-pkey.service';
import { FirstOrderService } from '../service/first-order.service';

@Injectable()
export class FirstOrderFacadeService {
  constructor(
    private readonly getStoreTablePkeyService: GetStoreTablePkeyService,
    private readonly firstOrderService: FirstOrderService,
  ) {}

  async firstOrder(
    storepkey: number,
    firstOrderDto: FirstOrderDto,
  ): Promise<{ rescode: '0000' | '0003' | '0002' }> {
    const { storetableset } = await this.getStoreTablePkeyService.getStoreTable(
      storepkey,
      firstOrderDto.storetablepkey,
    ); // 매장 테이블 조회

    if (storetableset.length === 1) {
      const storetable = storetableset[0];
      // 주문서 생성
      const { rescode } = await this.firstOrderService.createOrder(
        storepkey,
        firstOrderDto,
        storetable.storetablepkey,
      );
      return { rescode: rescode };
    } else {
      // 매장 테이블을 찾을 수 없음
      return { rescode: '0002' };
    }
  }
}
