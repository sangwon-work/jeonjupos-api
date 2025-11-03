import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { GetManagerByMidService } from '../service/get-manager-by-mid.service';
import { JwtSignService } from '../../../shared/jwt/jwt-sign.service';
import { ManagerVo } from '../vo/manager.vo';
import { PasswordService } from '../../../shared/password/password.service';

@Injectable()
export class LoginFacadeService {
  constructor(
    private readonly getManagerByMidService: GetManagerByMidService,
    private readonly jwtSignService: JwtSignService,
    private readonly passwordService: PasswordService,
  ) {}

  async login(loginDto: LoginDto): Promise<{
    rescode: '0000' | '8995' | '0001';
    data: { accesstoken: string };
  }> {
    // mid로 관리자 조회
    const { managerset } = await this.getManagerByMidService.getManager(
      loginDto.mid,
    );
    if (managerset.length === 1) {
      const manager: ManagerVo = managerset[0];
      // 비밀번호 일치여부 체크
      const check: boolean = await this.passwordService.checking(
        loginDto.mpassword,
        manager.mpassword,
      );

      if (check) {
        // 비밀번호 일치
        // token 발급
        const accesstoken: string =
          await this.jwtSignService.generateAccessToken({
            managerpkey: manager.managerpkey,
            storepkey: manager.storepkey,
          });

        return { rescode: '0000', data: { accesstoken: accesstoken } };
      } else {
        // 비밀번호 불일치
        return { rescode: '8995', data: { accesstoken: '' } };
      }
    } else {
      return { rescode: '0001', data: { accesstoken: '' } };
    }
  }
}
