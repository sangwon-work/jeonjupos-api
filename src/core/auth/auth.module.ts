import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthLoginService } from './auth-login.service';
import { AuthModel } from './auth.model';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../configuration/configuration.interface';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './guard/jwt-strategy.service';
import { JwtSignUtil } from './jwt-sign.util';

@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<Configuration['jwt']>('jwt').secret,
        signOptions: { expiresIn: '90d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthLoginService, AuthModel, JwtStrategy, JwtSignUtil],
})
export class AuthModule {}
