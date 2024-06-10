import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../../../shared/database/database.service';
import { PoolConnection } from 'mysql2/promise';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '../../../core/configuration/configuration.interface';
import { OwnerModel } from '../owner/owner.model';

@Injectable()
export class JwtSignUtil {
  private connection: PoolConnection;
  constructor(
    private jwtService: JwtService,
    private databaseService: DatabaseService,
    private readonly configService: ConfigService,
    private ownerModel: OwnerModel,
  ) {}

  async generateToken(owner: any, ownerPkey: number) {
    try {
      this.connection = await this.databaseService.getDBConnection();

      const payload = {
        ownerPkey: owner.ownerPkey,
        ownerId: owner.ownerId,
      };

      const accessToken = await this.generateAccessToken(payload);
      const refreshToken = await this.generateRefreshToken(payload);

      // 기존 token 삭제
      await this.ownerModel.deleteOwnerToken(this.connection, ownerPkey);

      // 새로 발급받은 token 저장
      await this.ownerModel.createOwnerToken(
        this.connection,
        ownerPkey,
        accessToken,
        refreshToken,
      );

      return { accessToken, refreshToken };
    } catch (err) {
      throw err;
    } finally {
      this.connection.release();
    }
  }

  /**
   * access token 발행
   * @param payload
   */
  async generateAccessToken(payload: any): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<Configuration['jwt']>('jwt').secret,
      expiresIn: '1h',
    });
  }

  /**
   * refresh token 발행
   * @param payload
   */
  async generateRefreshToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<Configuration['jwt']>('jwt').secret,
      expiresIn: '90d',
    });
  }
}
