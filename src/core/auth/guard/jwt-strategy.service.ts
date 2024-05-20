import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthModel } from '../auth.model';
import { DatabaseService } from '../../../shared/database/database.service';
import { Configuration } from '../../configuration/configuration.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'auth-jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authModel: AuthModel,
    private readonly databaseService: DatabaseService,
  ) {
    console.log('1111 1: ', process.env.JWT_SECRET);
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<Configuration['jwt']>('jwt').secret,
      passReqToCallback: true,
    });
  }

  validate(payload: any) {
    return payload;
  }
}
