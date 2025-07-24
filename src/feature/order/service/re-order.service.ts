import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { OrderModel } from '../order.model';
import { PoolConnection } from 'mysql2/promise';
import { ReOrderDto } from '../dto/re-order.dto';

@Injectable()
export class ReOrderService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly orderModel: OrderModel,
  ) {}

  async reOrder(reOrderDto: ReOrderDto) {
    let connection: PoolConnection | null = null;

    try {
      connection = await this.databaseService.getDBConnection();
      await connection.beginTransaction();

      let orderprice = 0;
      for (const orderfood of reOrderDto.orderfoodlist) {
        const foodset = await this.orderModel.getFood(
          connection,
          orderfood.foodpkey,
        );
        const food = foodset[0];
        if (orderfood.orderfoodpkey !== 0) {
          // 주문메뉴 수량 변경
          if (orderfood.ordercount > 0) {
            orderprice += food.saleprice * orderfood.ordercount;
            await this.orderModel.updateOrderFoodCount(
              connection,
              orderfood.orderfoodpkey,
              orderfood.ordercount,
            );
          } else {
            // 주문메뉴 삭제
            await this.orderModel.deleteOrderFood(
              connection,
              orderfood.orderfoodpkey,
            );
          }
        } else {
          // 주문메뉴 생성
          if (orderfood.ordercount > 0) {
            orderprice += food.saleprice * orderfood.ordercount;
            await this.orderModel.createOrderFood(
              connection,
              reOrderDto.orderinfopkey,
              food,
              orderfood.ordercount,
            );
          }
        }
      }

      // 결제정보 주문금액 수정
      await this.orderModel.updatePayInfoOrderPrice(
        connection,
        reOrderDto.orderinfopkey,
        orderprice,
      );

      await connection.commit();
      return { rescode: '0000' };
    } catch (err) {
      await connection?.rollback();
      throw err;
    } finally {
      connection?.release();
    }
  }
}
