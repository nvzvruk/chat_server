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

  getJwtPayload(user: User): JwtPayload {
    return {
      sub: user.id,
      username: user.name,
    };
  }

  generateAccessToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  generateRefreshToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, { expiresIn: '15d' });
  }

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
    const jwtPayload = this.getJwtPayload(user);
    const accessToken = this.generateAccessToken(jwtPayload);
    const refreshToken = this.generateRefreshToken(jwtPayload);

    await this.userService.setRefreshToken(user.id, refreshToken);

    return {
      ...user,
      accessToken,
    };
  }

  async refreshToken(payload: JwtPayload) {
    const accessToken = this.generateAccessToken(payload);

    // TODO Save refresh token in DB or/and Cookie

    return {
      accessToken,
    };
  }

  async logout(id: User['id']) {
    return await this.userService.setRefreshToken(id, null);
  }
}
