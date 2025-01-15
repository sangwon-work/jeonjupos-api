import { Module } from '@nestjs/common';
import { StoreTableController } from './store-table.controller';
import { StoreTableModel } from './store-table.model';
import { GetStoreTableByInStoreService } from './service/get-store-table-by-in-store.service';
import { GetStoreTableListFacadeService } from './facade/get-store-table-list-facade.service';

@Module({
  controllers: [StoreTableController],
  providers: [
    StoreTableModel,
    GetStoreTableByInStoreService,
    GetStoreTableListFacadeService,
  ],
})
export class StoreTableModule {}
