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
import { UserService } from '@/user/service/user.service';
import { LocalGuard } from '@/auth/guards/local-guard';
import { RefreshJwtGuard } from '@/auth/guards/refresh-jwt-guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @UseGuards(LocalGuard)
  @Post('login')
  async signIn(@Request() request, @Res({ passthrough: true }) res) {
    return await this.authService.login(request.user, res);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user);
  }
}
