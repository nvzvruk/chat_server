import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types';

export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor() {
    super({
      ignoreExpiration: false,
      secretOrKey: `${process.env.JWT_SECRET}`,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => request.cookies['refresh_token'],
      ]),
    });
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}
