import { Module } from '@nestjs/common';
import { StoreTableModule } from '../store-table/store-table.module';
import { OrderController } from './order.controller';
import { OrderModel } from './order.model';
import { GetOrderInfoByStoreTableService } from './service/get-order-info-by-store-table.service';
import { GetOrderInfoFacadeService } from './facade/get-order-info-facade.service';
import { GetOrderFoodListService } from './service/get-order-food-list.service';
import { GetOrderFoodListFacadeService } from './facade/get-order-food-list-facade.service';
import { FirstOrderService } from './service/first-order.service';
import { FirstOrderFacadeService } from './facade/first-order-facade.service';
import { GetOrderInfoByPkeyService } from './service/get-order-info-by-pkey.service';
import { ReOrderService } from './service/re-order.service';
import { ReOrderFacadeService } from './facade/re-order-facade.service';
import { GetOpenDiningSessionService } from './service/get-dining-session.service';

@Module({
  imports: [StoreTableModule],
  controllers: [OrderController],
  providers: [
    OrderModel,
    GetOrderInfoByStoreTableService,
    GetOrderInfoFacadeService,
    GetOrderFoodListService,
    GetOrderFoodListFacadeService,
    FirstOrderService,
    FirstOrderFacadeService,
    GetOrderInfoByPkeyService,
    ReOrderService,
    ReOrderFacadeService,
    GetOpenDiningSessionService,
  ],
})
export class OrderModule {}
