import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../../core/configuration/configuration.interface';

/**
 * access, refresh token 발급
 */
@Injectable()
export class JwtSignService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(payload: { managerpkey: number }): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<Configuration['jwt']>('jwt').secret,
      expiresIn: '90d',
    });
  }

  async generateRefreshToken(payload: {
    managerpkey: number;
  }): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<Configuration['jwt']>('jwt').secret,
      expiresIn: '90d',
    });
  }
}
