import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '@/user/service/user.service';
import { User } from '@/user/user.entity';
import { CreateUserDto } from '@/user/user.dto';
import { AuthError, JwtPayload } from '../types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.findByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, refreshToken, ...restUser } = user;
      return restUser;
    }

    return null;
  }

  async generateAccessToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    });
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      username: user.name,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    });

    const refreshCookie = `refresh_token=${refreshToken}; HttpOnly; Path=/; Max-Age=${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}`;

    await this.userService.setRefreshToken(user.id, refreshToken);

    return {
      ...user,
      accessToken,
      refreshCookie,
    };
  }

  async signUp(userData: CreateUserDto) {
    const existingUser = await this.userService.findByUsername(userData.name);

    if (existingUser) {
      throw new ConflictException(AuthError.UserWithSuchNameExists);
    }

    const createdUser = await this.userService.create(userData);

    return await this.login(createdUser);
  }

  async logout(id: User['id']) {
    return await this.userService.setRefreshToken(id, null);
  }
}
