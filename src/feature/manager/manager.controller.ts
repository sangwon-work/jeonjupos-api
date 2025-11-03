import {
  Controller,
  Post,
  Request,
  Response,
  Req,
  Res,
  Body,
  UseGuards,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LoginFacadeService } from './facade/login-facade.service';
import { AuthGuard } from '@nestjs/passport';
import { respond } from '../../shared/utils/response/response';

@Controller('manager')
export class ManagerController {
  constructor(private readonly loginFacadeService: LoginFacadeService) {}

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
    const { rescode, data } = await this.loginFacadeService.login(loginDto);
    return respond(rescode, '', data);
  }

  /**
   * access token 검증
   */
  @Post('/access-token')
  @UseGuards(AuthGuard('access'))
  async accessToken() {
    return respond('0000', '', {});
  }
}
