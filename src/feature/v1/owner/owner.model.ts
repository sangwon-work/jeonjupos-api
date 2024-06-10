import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/database/database.service';
import { LoginDto } from './dto/login.dto';
import { PoolConnection } from 'mysql2/promise';
import { OwnerCreateDto } from './dto/owner-create.dto';

@Injectable()
export class OwnerModel {
  private sql: string;
  private params: any[];

  constructor(private databaseService: DatabaseService) {}

  /**
   * 점주 Id 중복체크
   * @param connection
   * @param ownerId
   */
  async ownerIdDuplicate(connection: PoolConnection, ownerId: string) {
    this.sql = `select * from owner where ownerId=?`;
    this.params = [ownerId];
    return await this.databaseService.dbQuery(
      connection,
      this.sql,
      this.params,
    );
  }

  /**
   * 점주 추가
   * @param connection
   * @param ownerCreateDto
   */
  async createOwner(
    connection: PoolConnection,
    ownerCreateDto: OwnerCreateDto,
  ) {
    this.sql = `insert into owner (ownerId, ownerPassword, ownerName) values (?, ?, ?)`;
    this.params = [
      ownerCreateDto.ownerId,
      ownerCreateDto.ownerPassword,
      ownerCreateDto.ownerName,
    ];
    return await this.databaseService.dbQuery(
      connection,
      this.sql,
      this.params,
    );
  }

  /**
   * 점주 조회
   * @param connection
   * @param loginDto
   */
  async getOwnerOne(connection: PoolConnection, loginDto: LoginDto) {
    try {
      this.sql = `
        select owner.ownerPkey, ownerId, ownerPassword
        from owner 
        where ownerId=?`;
      this.params = [loginDto.ownerId];
      return await this.databaseService.dbQuery(
        connection,
        this.sql,
        this.params,
      );
    } catch (err) {
      throw err;
    }
  }

  /**
   * 토큰으로 회원 조회
   * @param connection
   * @param token
   */
  async getOwnerToken(connection: PoolConnection, token: string) {
    try {
      this.sql = `
        select owner.ownerPkey, ownerId
        from owner 
        join ownerToken on owner.ownerPkey=ownerToken.ownerPkey
        where ownerToken.accessToken=?;
      `;
      this.params = [token];
      return await this.databaseService.dbQuery(
        connection,
        this.sql,
        this.params,
      );
    } catch (err) {
      throw err;
    }
  }

  /**
   * 점주 token 삭제
   * @param connection
   * @param ownerPkey
   */
  async deleteOwnerToken(connection: PoolConnection, ownerPkey: number) {
    this.sql = `delete from ownerToken where ownerPkey=?`;
    this.params = [ownerPkey];
    return await this.databaseService.dbQuery(
      connection,
      this.sql,
      this.params,
    );
  }

  /**
   * 점주 token 저장
   * @param connection
   * @param ownerPkey
   * @param accessToken
   * @param refreshToken
   */
  async createOwnerToken(
    connection: PoolConnection,
    ownerPkey: number,
    accessToken: string,
    refreshToken: string,
  ) {
    this.sql = `insert into ownerToken (ownerPkey, accessToken, refreshToken, expireDate) values (?, ?, ?, date_add(now(), interval 90 day));`;
    this.params = [ownerPkey, accessToken, refreshToken];
    return await this.databaseService.dbQuery(
      connection,
      this.sql,
      this.params,
    );
  }
}
