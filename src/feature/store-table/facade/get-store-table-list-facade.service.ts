import { Injectable } from '@nestjs/common';
import { GetStoreTableByInStoreService } from '../service/get-store-table-by-in-store.service';
import { GetStoreTableOrderListService } from '../service/get-store-table-order-list.service';

@Injectable()
export class GetStoreTableListFacadeService {
  constructor(
    private readonly getStoreTableByInStoreService: GetStoreTableByInStoreService,
    private readonly getStoreTableOrderListService: GetStoreTableOrderListService,
  ) {}

  /**
   * 매장별 매장식사 테이블 조회
   * @param storepkey
   */
  async getStoreTableList(storepkey: number) {
    try {
      const { storetableset } =
        await this.getStoreTableByInStoreService.getStoreTableList(storepkey);

      const storetablelist = storetableset.map(async (storetable) => {
        // 테이블 주문내역 조회
        const { orderset } =
          await this.getStoreTableOrderListService.getOrderList(
            storetable.storetablepkey,
          );

        let totalorderprice = 0;
        let regdate: string = '';
        const orderlist = orderset.map((order) => {
          totalorderprice += order.saleprice * order.ordercount;
          regdate = order.regdate;
          return {
            foodname: order.foodname,
            ordercount: order.ordercount,
          };
        });
        return {
          ...storetable,
          totalorderprice: totalorderprice,
          regdate: regdate,
          orderlist: orderlist,
        };
      });

      return { data: { storetableset: await Promise.all(storetablelist) } };
    } catch (err) {
      throw err;
    }
  }
}
