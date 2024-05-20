import {
  Controller,
  Post,
  Body,
  Response,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ResponseUtil } from '../../shared/response/response.util';
import { LoginDto } from './dto/login.dto';
import { AuthLoginService } from './auth-login.service';
import { JwtSignUtil } from './jwt-sign.util';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private responseUtil: ResponseUtil,
    private authLoginService: AuthLoginService,
    private jwtSignUtil: JwtSignUtil,
  ) {}

  /**
   * 로그인
   * @param res
   * @param loginDto
   */
  @Post('/login')
  async login(@Response() res: Response, @Body() loginDto: LoginDto) {
    try {
      // 회원 조회 및 비밀번호 검증
      const owner = await this.authLoginService.login(loginDto);
      if (owner !== null) {
        const token = await this.jwtSignUtil.sign(owner, owner.ownerpkey);

        return this.responseUtil.response(res, 200, '0000', '', {
          token: token,
          owner: {
            ownerpkey: owner.ownerpkey,
            ownerid: owner.ownerid,
          },
          store: {
            storename: owner.storename,
            storepkey: owner.storepkey,
          },
        });
      } else {
        return this.responseUtil.response(res, 200, '0001', '', {});
      }
    } catch (err) {
      console.log('11111 : ', err);
      console.log('22222 : ', err.name);
      console.log('33333 : ', err.response);
      if (err.name === 'UnauthorizedException') {
        return this.responseUtil.response(res, err.status, '8995', '', {});
      }
      return this.responseUtil.response(res, 500, '9999', '', {});
    }
  }

  /**
   * jwt 로그인
   * @param res
   * @param req
   */
  @Post('/jwt/login')
  @UseGuards(AuthGuard('auth-jwt'))
  async jwtLogin(@Response() res: Response, @Req() req: any) {
    try {
      console.log('111111 : ', req.user);
      const token = req.headers.authorization.split(' ')[1];

      // 토큰으로 회원 조회
      const owner = await this.authLoginService.getOwner(token);

      if (owner === null) {
        return this.responseUtil.response(res, 200, '0014', '', {});
      } else {
        // 토큰 재발급
        const reToken = await this.jwtSignUtil.sign(owner, owner.ownerpkey);

        return this.responseUtil.response(res, 200, '0000', '', {
          token: reToken,
          owner: {
            ownerpkey: owner.ownerpkey,
            ownerid: owner.ownerid,
          },
          store: {
            storename: owner.storename,
            storepkey: owner.storepkey,
          },
        });
      }
    } catch (err) {
      return this.responseUtil.response(res, 500, '9999', '', {});
    }
  }
}
