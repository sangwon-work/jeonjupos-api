import { Module } from '@nestjs/common';
import { MenuModule } from './menu/menu.module';
import { MenuCategoryModule } from './menu-category/menu-category.module';
import { OrderModule } from './order/order.module';
import { PayModule } from './pay/pay.module';
import { TablesModule } from './tables/tables.module';

/**
 * Feature Modules: 애플리케이션의 각 기능별로 모듈을 만듭니다.
 * 각 Feature 모듈은 해당 기능과 관련된 서비스, 컨트롤러, 프로바이더 등을 포함합니다.
 * 'UserModule', 'PostModule', CommentModule' 등의 모듈이 여기에 해당합니다.
 */
@Module({
  imports: [
    MenuModule,
    MenuCategoryModule,
    OrderModule,
    PayModule,
    TablesModule,
  ],
})
export class FeatureModule {}
