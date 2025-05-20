import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthJwtPayload } from '../types/auth.jwt-payload';
import { AuthService } from '../auth.service';
import refreshConfig from '../config/refresh.config';
import { Request } from 'express';

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
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: AuthJwtPayload) {
    const id = payload.sub;
    const { refreshToken } = req.body as { refreshToken: string };

    return this.authService.validateRefreshToken(id, refreshToken);
  }
}
