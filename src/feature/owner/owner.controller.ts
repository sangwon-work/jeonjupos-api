import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  Response,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { ResponseUtil } from '../../shared/response/response.util';
import { OwnerLoginService } from './services/owner-login.service';
import { JwtSignUtil } from '../common/jwt-sign.util';
import { OwnerCreateDto } from './dto/owner-create.dto';
import { OwnerCreateService } from './services/owner-create.service';

@Controller('/owner')
export class OwnerController {
  constructor(
    private responseUtil: ResponseUtil,
    private ownerLoginService: OwnerLoginService,
    private jwtSignUtil: JwtSignUtil,
    private ownerCreateService: OwnerCreateService,
  ) {}

  @Post('/create')
  async createOwner(
    @Req() req: any,
    @Res() res: any,
    @Body() ownerCreateDto: OwnerCreateDto,
  ) {
    try {
      // 점주 생성
      const { resCode } = await this.ownerCreateService.create(ownerCreateDto);
      return this.responseUtil.response(res, 200, resCode, '', {});
    } catch (err) {
      return this.responseUtil.response(res, 500, '9999', '', err);
    }
  }

  /**
   * 로그인
   * @param res
   * @param loginDto
   */
  @Post('/login')
  async login(@Response() res: Response, @Body() loginDto: LoginDto) {
    try {
      // 회원 조회 및 비밀번호 검증
      const { resCode, owner } = await this.ownerLoginService.login(loginDto);

      if (resCode === '0000') {
        // 토큰 발급
        const { accessToken, refreshToken } =
          await this.jwtSignUtil.generateToken(owner, owner.ownerPkey);

        return this.responseUtil.response(res, 200, '0000', '', {
          accessToken: accessToken,
          refreshToken: refreshToken,
          owner: {
            ownerpkey: owner.ownerPkey,
            ownerid: owner.ownerId,
          },
          // store: {
          //   storename: owner.storeName,
          //   storepkey: owner.storePkey,
          // },
        });
      } else {
        return this.responseUtil.response(res, 200, resCode, '', {});
      }
    } catch (err) {
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
      const token = req.headers.authorization.split(' ')[1];

      // 토큰으로 회원 조회
      const owner = await this.ownerLoginService.getOwner(token);

      if (owner === null) {
        return this.responseUtil.response(res, 200, '0014', '', {});
      } else {
        // 토큰 재발급
        // const { accessToken, refreshToken } =
        //   await this.jwtSignUtil.generateToken(owner, owner.ownerPkey);

        return this.responseUtil.response(res, 200, '0000', '', {
          // accessToken: accessToken,
          // refreshToken: refreshToken,
          owner: {
            ownerpkey: owner.ownerPkey,
            ownerid: owner.ownerId,
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
