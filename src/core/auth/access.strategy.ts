import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Configuration } from 'src/core/configuration/configuration.interface';
@Injectable()
export class AccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<Configuration['jwt']>('jwt').secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    try {
      const authorization = req.headers['authorization'];
      const [identifier, token] = authorization.split(' ');

      return payload;
    } catch (err) {
      throw err;
    }
  }
}
