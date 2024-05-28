import { Injectable } from '@nestjs/common';
import { PoolConnection } from 'mysql2/promise';
import { DatabaseService } from '../../../shared/database/database.service';
import { OwnerModel } from '../owner.model';
import { OwnerCreateDto } from '../dto/owner-create.dto';
import { PasswordBcryptUtil } from '../../common/password-bcrypt.util';

@Injectable()
export class OwnerCreateService {
  private connection: PoolConnection;

  constructor(
    private databaseService: DatabaseService,
    private ownerModel: OwnerModel,
    private passwordBcryptUtil: PasswordBcryptUtil,
  ) {}

  /**
   * 점주 생성
   * @param ownerCreateDto
   */
  async create(ownerCreateDto: OwnerCreateDto): Promise<{ resCode: string }> {
    try {
      this.connection = await this.databaseService.getDBConnection();

      // ownerId 중복체크
      const isDuplicate = await this.isOwnerIdDuplicate(ownerCreateDto.ownerId);
      if (!isDuplicate) {
        return { resCode: '0001' };
      }

      // ownerPassword 암호화
      ownerCreateDto.ownerPassword = await this.passwordBcryptUtil.pwBcrypt(
        ownerCreateDto.ownerPassword,
      );
      // owner 추가
      await this.ownerModel.createOwner(this.connection, ownerCreateDto);

      return { resCode: '0000' };
    } catch (err) {
      throw err;
    } finally {
      this.connection.release();
    }
  }

  /**
   * ownerId 중복체크
   * @param ownerId
   */
  async isOwnerIdDuplicate(ownerId: string): Promise<boolean> {
    try {
      // 중복체크
      const ownerSet = await this.ownerModel.ownerIdDuplicate(
        this.connection,
        ownerId,
      );
      return ownerSet.length <= 0;
    } catch (err) {
      throw err;
    }
  }
}
