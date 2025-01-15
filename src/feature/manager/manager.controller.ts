import {
  Controller,
  Post,
  Request,
  Response,
  Req,
  Res,
  Body,
} from '@nestjs/common';
import { ResponseUtil } from '../../shared/response/response.util';
import { LoginDto } from './dto/login.dto';
import { LoginFacadeService } from './facade/login-facade.service';

@Controller('manager')
export class ManagerController {
  constructor(
    private readonly responseUtil: ResponseUtil,
    private readonly loginFacadeService: LoginFacadeService,
  ) {}

  /**
   * 로그인
   * @param req
   * @param res
   * @param loginDto
   */
  @Post('/login')
  async login(
    @Req() req: Request,
    @Res() res: Response,
    @Body() loginDto: LoginDto,
  ) {
    try {
      const { rescode, data } = await this.loginFacadeService.login(loginDto);
      return this.responseUtil.response(res, 200, rescode, '', data);
    } catch (err) {
      console.log(err);
      return this.responseUtil.response(res, 500, '9999', '', {});
    }
  }
}
