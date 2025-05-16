import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthJwtPayload } from '../types/auth.jwt-payload';
import { AuthService } from '../auth.service';
import refreshConfig from '../config/refresh.config';

@Injectable()
export class RefreshTokenJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    @Inject(refreshConfig.KEY) private refreshTokenConfig: { secret: string },
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: refreshTokenConfig.secret,
      ignoreExpiration: false,
    });
  }

  validate(payload: AuthJwtPayload) {
    const id = payload.sub;
    return this.authService.validateRefreshToken(id);
  }
}
