import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '@/user/service/user.service';
import { User } from '@/user/user.entity';
import { CreateUserDto } from '@/user/user.dto';
import { JwtPayload } from '../types';

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

  async signUp(userData: CreateUserDto) {
    const existingUser = await this.userService.findByUsername(userData.name);

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const createdUser = await this.userService.create(userData);

    const accessToken = this.generateAccessToken({
      username: createdUser.name,
      sub: createdUser.id,
    });

    const refreshToken = this.generateAccessToken({
      username: createdUser.name,
      sub: createdUser.id,
    });

    await this.userService.setRefreshToken(createdUser.id, refreshToken);

    return {
      ...createdUser,
      accessToken,
    };
  }

  async login(user: User) {
    const accessToken = this.generateAccessToken({
      sub: user.id,
      username: user.name,
    });
    const refreshToken = this.generateRefreshToken({
      sub: user.id,
      username: user.name,
    });

    await this.userService.setRefreshToken(user.id, refreshToken);

    return {
      ...user,
      accessToken,
    };
  }

  async logout(id: User['id']) {
    return await this.userService.setRefreshToken(id, null);
  }

  generateAccessToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    });
  }

  generateRefreshToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    });
  }

  getCookieWithJwtRefreshToken(id: User['id'], name: string) {
    const token = this.generateAccessToken({ sub: id, username: name });
    return `refresh_token=${token}; HttpOnly; Path=/; Max-Age=${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}`;
  }
}
