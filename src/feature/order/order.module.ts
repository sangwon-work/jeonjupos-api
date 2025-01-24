import { Module } from '@nestjs/common';
import { StoreTableModule } from '../store-table/store-table.module';
import { OrderController } from './order.controller';
import { OrderModel } from './order.model';
import { GetOrderListByStoreTableService } from './service/get-order-list-by-store-table.service';
import { GetOrderInfoFacadeService } from './facade/get-order-info-facade.service';

@Module({
  imports: [StoreTableModule],
  controllers: [OrderController],
  providers: [
    OrderModel,
    GetOrderListByStoreTableService,
    GetOrderInfoFacadeService,
  ],
})
export class OrderModule {}
