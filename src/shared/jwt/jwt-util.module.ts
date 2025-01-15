import { Global, Module } from '@nestjs/common';
import { JwtSignService } from './jwt-sign.service';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../../core/configuration/configuration.interface';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<Configuration['jwt']>('jwt').secret,
      }),
    }),
  ],
  providers: [JwtSignService],
  exports: [JwtSignService],
})
export class JwtUtilModule {}
