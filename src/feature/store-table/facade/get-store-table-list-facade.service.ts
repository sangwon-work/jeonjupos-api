import { Injectable } from '@nestjs/common';
import { GetStoreTableByInStoreService } from '../service/get-store-table-by-in-store.service';
import { GetStoreTableOrderListService } from '../service/get-store-table-order-list.service';
import { StoreTableListVo } from '../vo/store-table-list.vo';
import { StoreTableOrderListVo } from '../vo/store-table-order-list.vo';

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
  async getStoreTableList(
    storepkey: number,
  ): Promise<{ data: { storetableset: StoreTableListVo[] } }> {
    const { storetableset } =
      await this.getStoreTableByInStoreService.getStoreTableList(storepkey);

    const storetablelist = storetableset.map(
      async (storetable: StoreTableListVo) => {
        // 테이블 주문내역 조회
        const { orderset } =
          await this.getStoreTableOrderListService.getOrderList(
            storetable.storetablepkey,
          );

        let totalorderprice = 0;
        let regdate = '';
        const orderlist = orderset.map((order: StoreTableOrderListVo) => {
          totalorderprice += order.saleprice * order.ordercount;
          const orderregdate = new Date(order.regdate);
          orderregdate.setHours(orderregdate.getHours() + 9);
          regdate = `${orderregdate.getHours()}:${orderregdate.getMinutes()}:${orderregdate.getSeconds()}`;
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
      },
    );

    return { data: { storetableset: await Promise.all(storetablelist) } };
  }
}
