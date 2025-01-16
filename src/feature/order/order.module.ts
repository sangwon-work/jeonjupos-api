import { Module } from '@nestjs/common';
import { StoreTableModule } from '../store-table/store-table.module';
import { OrderController } from './order.controller';
import { OrderModel } from './order.model';
import { GetOrderListService } from './service/get-order-list.service';
import { GetOrderInfoFacadeService } from './facade/get-order-info-facade.service';

@Module({
  imports: [StoreTableModule],
  controllers: [OrderController],
  providers: [OrderModel, GetOrderListService, GetOrderInfoFacadeService],
})
export class OrderModule {}
