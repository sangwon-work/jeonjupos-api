import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { OrderModel } from '../order.model';
import { FirstOrderDto } from '../dto/first-order.dto';
import { PoolConnection } from 'mysql2/promise';

@Injectable()
export class FirstOrderService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly orderModel: OrderModel,
  ) {}

  async createOrder(storepkey: number, firstOrderDto: FirstOrderDto) {
    let connection: PoolConnection | null = null;

    try {
      connection = await this.databaseService.getDBConnection();
      await connection.beginTransaction();

      // 주문서 생성
      const orderinfo = await this.orderModel.createOrderInfo(
        connection,
        firstOrderDto.storetablepkey,
        firstOrderDto.ordertype,
        '',
      );
      const orderinfopkey: number = orderinfo.insertId;
      let orderprice = 0;

      // 주문메뉴 생성
      for (const orderfood of firstOrderDto.orderfoodlist) {
        const foodset = await this.orderModel.getFood(
          connection,
          orderfood.foodpkey,
        );
        if (foodset.length === 1) {
          const food = foodset[0];
          orderprice += food.saleprice * orderfood.ordercount;
          if (orderfood.ordercount > 0) {
            await this.orderModel.createOrderFood(
              connection,
              orderinfopkey,
              food,
              orderfood.ordercount,
            );
          }
        } else {
          // 메뉴를 찾을 수 없습니다.
          await connection.rollback();
          return { rescode: '0003' };
        }
      }

      // 테이블 식사중으로 변경
      await this.orderModel.updateStoreTableDining(
        connection,
        firstOrderDto.storetablepkey,
        'Y',
      );

      // 결제정보 저장
      await this.orderModel.createPayInfo(
        connection,
        orderinfopkey,
        storepkey,
        this.generateRandomTid(),
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

  generateRandomTid(): string {
    const alphabetarr = [
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
    ];
    // 주문번호 생성
    const now: number = Date.now();
    const nowhex: string = now.toString(16).toUpperCase();

    let str = '';
    for (let i = 0; i < 4; i++) {
      str += alphabetarr[Math.floor(Math.random() * 26)];
    }
    return `${str}${nowhex}`;
  }
}
