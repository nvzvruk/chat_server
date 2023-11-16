import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '@/user/service/user.service';
import { User } from '@/user/user.entity';
import { CreateUserDto } from '@/user/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  generateTokens(user) {
    const payload = {
      username: user.name,
      sub: user.id,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
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

    const { accessToken, refreshToken } = this.generateTokens(createdUser);

    await this.userService.updateRefreshToken(createdUser.id, refreshToken);

    return {
      ...createdUser,
      accessToken,
    };
  }

  async login(user: User) {
    const { accessToken, refreshToken } = this.generateTokens(user);

    await this.userService.updateRefreshToken(user.id, refreshToken);

    return {
      ...user,
      accessToken,
    };
  }

  async refreshToken(user: User) {
    const { accessToken } = this.generateTokens(user);

    // TODO Save refresh token in DB or/and Cookie

    return {
      accessToken,
    };
  }

  async logout(id: User['id']) {
    return await this.userService.updateRefreshToken(id, null);
  }
}
