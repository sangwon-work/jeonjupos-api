import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { GetManagerByMidService } from '../service/get-manager-by-mid.service';
import { JwtSignService } from '../../../shared/jwt/jwt-sign.service';

@Injectable()
export class LoginFacadeService {
  constructor(
    private readonly getManagerByMidService: GetManagerByMidService,
    private readonly jwtSignService: JwtSignService,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      // mid로 관리자 조회
      const { managerset } = await this.getManagerByMidService.getManager(
        loginDto.mid,
      );

      if (managerset.length === 1) {
        const manager = managerset[0];
        // TODO 비밀번호 일치여부 체크

        // token 발급
        const accesstoken: string =
          await this.jwtSignService.generateAccessToken({
            managerpkey: manager.managerpkey,
            storepkey: manager.storepkey,
          });

        return { rescode: '0000', data: { accesstoken: accesstoken } };
      } else {
        return { rescode: '0001', data: { accesstoken: '' } };
      }
    } catch (err) {
      throw err;
    }
  }
}
