import { Global, Module } from '@nestjs/common';
import { AwsModule } from './aws/aws.module';
import { JwtUtilModule } from './jwt/jwt-util.module';
import { PasswordModule } from './password/password.module';
import { PaginationModule } from './pagination/pagination.module';

/**
 * Shared Module: 여러 Feature 모듈에서 사용할 수 있는 서비스나 팩토리 등을 공유하기 위한 모듈입니다.
 * 반복적으로 사용되는 기능 추상화하여 한 곳에서 관리할 수 있습니다.
 * 'DatabaseModule', 'CacheModule' 등이 여기에 해당됩니다.
 */
@Global()
@Module({
  imports: [AwsModule, JwtUtilModule, PasswordModule, PaginationModule],
})
export class SharedModule {}
