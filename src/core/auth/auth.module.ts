import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../configuration/configuration.interface';
import { PassportModule } from '@nestjs/passport';
import { AccessStrategy } from './access.strategy';

@Global()
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<Configuration['jwt']>('jwt').secret,
        // signOptions: { expiresIn: '90d' },
      }),
    }),
  ],
  controllers: [],
  providers: [AccessStrategy],
})
export class AuthModule {}
