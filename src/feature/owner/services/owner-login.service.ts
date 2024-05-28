import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { DatabaseService } from '../../../shared/database/database.service';
import { PoolConnection } from 'mysql2/promise';
import { PasswordBcryptUtil } from '../../common/password-bcrypt.util';
import { OwnerModel } from '../owner.model';

@Injectable()
export class OwnerLoginService {
  private connection: PoolConnection;

  constructor(
    private databaseService: DatabaseService,
    private ownerModel: OwnerModel,
    private passwordBcryptUtil: PasswordBcryptUtil,
  ) {}

  /**
   * 로그인
   * 점주 조회 및 비밀번호 일치여부 체크
   * @param loginDto
   */
  async login(loginDto: LoginDto): Promise<{
    resCode: string;
    owner: any;
  }> {
    try {
      this.connection = await this.databaseService.getDBConnection();
      // 회원 조회
      const ownerSet = await this.ownerModel.getOwnerOne(
        this.connection,
        loginDto,
      );

      if (ownerSet.length === 0) {
        return { resCode: '0002', owner: null };
      } else {
        const owner = ownerSet[0];

        // 비밀번호 검증
        const pwdValid = await this.passwordBcryptUtil.pwValid(
          loginDto.ownerPassword,
          owner.ownerPassword,
        );

        if (!pwdValid) {
          throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
        } else {
          return { resCode: '0000', owner: owner };
        }
      }
    } catch (err) {
      throw err;
    } finally {
      this.connection.release();
    }
  }

  /**
   * 토큰으로 회원 조회
   * @param token
   */
  async getOwner(token: string) {
    try {
      this.connection = await this.databaseService.getDBConnection();

      const owner = await this.ownerModel.getOwnerToken(this.connection, token);

      return owner.length !== 1 ? null : owner[0];
    } catch (err) {
      throw err;
    } finally {
      this.connection.release();
    }
  }
}
