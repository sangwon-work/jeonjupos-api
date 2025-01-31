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

  private connection: PoolConnection = undefined;

  async reOrder(reOrderDto: ReOrderDto) {
    try {
      this.connection = await this.databaseService.getDBConnection();
      await this.connection.beginTransaction();

      for (const orderfood of reOrderDto.orderfoodlist) {
        const foodset = await this.orderModel.getFood(
          this.connection,
          orderfood.foodpkey,
        );
        const food = foodset[0];
        if (orderfood.orderfoodpkey !== 0) {
          // 주문메뉴 수량 변경
          if (orderfood.ordercount > 0) {
            await this.orderModel.updateOrderFoodCount(
              this.connection,
              orderfood.orderfoodpkey,
              orderfood.ordercount,
            );
          } else {
            // 주문메뉴 삭제
            await this.orderModel.deleteOrderFood(
              this.connection,
              orderfood.orderfoodpkey,
            );
          }
        } else {
          // 주문메뉴 생성
          if (orderfood.ordercount > 0) {
            await this.orderModel.createOrderFood(
              this.connection,
              reOrderDto.orderinfopkey,
              food,
              orderfood.ordercount,
            );
          }
        }
      }

      await this.connection.commit();
      return { rescode: '0000' };
    } catch (err) {
      if (this.connection !== undefined) {
        await this.connection.rollback();
      }
      throw err;
    } finally {
      if (this.connection !== undefined) {
        this.connection.release();
      }
    }
  }
}
