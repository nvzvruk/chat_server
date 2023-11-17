import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CreateUserDto } from '@/user/user.dto';
import { LocalGuard } from '@/auth/guards/local-guard';
import { RefreshJwtGuard } from '@/auth/guards/refresh-jwt-guard';
import { JwtGuard } from '@/auth/guards/jwt-guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async registerUser(@Body() userData: CreateUserDto) {
    return await this.authService.signUp(userData);
  }

  @UseGuards(LocalGuard)
  @Post('login')
  async login(@Request() request) {
    const { id, name } = request.user;
    const refreshJwtCookie = this.authService.getCookieWithJwtRefreshToken(
      id,
      name,
    );

    request.res.setHeader('Set-Cookie', refreshJwtCookie);
    return await this.authService.login(request.user);
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  async logout(@Request() request, @Res({ passthrough: true }) response) {
    response.clearCookie('refresh_token');
    return await this.authService.logout(request.user.sub);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() request) {
    const { sub, username } = request.user;
    return this.authService.generateAccessToken({ sub, username });
  }
}
