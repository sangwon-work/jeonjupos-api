import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

/**
 * Core Module: 애플리케이션의 공통적으로 사용되는 서비스, 컨트롤러, 프로바이더 등을 포함합니다.
 * 이 모듈은 다른 모듈에서도 필요로 하는 핵심적인 서비스와 공통 로직을 제공합니다.
 * 'AuthModule', 'LoggerModule', 'ConfigModule' 등의 기본적인 모듈이 여기에 포함될 수 있습니다.
 */
@Module({
  imports: [AuthModule],
})
export class CoreModule {}
