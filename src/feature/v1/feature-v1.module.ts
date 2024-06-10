import { Module } from '@nestjs/common';
import { OwnerModule } from './owner/owner.module';
import { MenuModule } from './menu/menu.module';
import { MenuCategoryModule } from './menu-category/menu-category.module';
import { OrderModule } from './order/order.module';
import { PayModule } from './pay/pay.module';
import { TablesModule } from './tables/tables.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    OwnerModule,
    MenuModule,
    MenuCategoryModule,
    OrderModule,
    PayModule,
    TablesModule,
    CommonModule,
  ],
})
export class FeatureModuleV1 {}
