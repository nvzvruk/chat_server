import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthError } from '@/auth/types';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  handleRequest(_, payload, tokenExpiredError) {
    if (tokenExpiredError) {
      throw new UnauthorizedException({
        ...tokenExpiredError,
        name: AuthError.AccessTokenExpired,
      });
    }
    return payload;
  }
}
