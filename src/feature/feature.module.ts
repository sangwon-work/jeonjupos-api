import { Module } from '@nestjs/common';
import { FeatureModuleV1 } from './v1/feature-v1.module';

/**
 * Feature Modules: 애플리케이션의 각 기능별로 모듈을 만듭니다.
 * 각 Feature 모듈은 해당 기능과 관련된 서비스, 컨트롤러, 프로바이더 등을 포함합니다.
 * 'UserModule', 'PostModule', CommentModule' 등의 모듈이 여기에 해당합니다.
 */
@Module({
  imports: [FeatureModuleV1],
})
export class FeatureModule {}
