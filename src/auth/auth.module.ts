import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from '@/user/user.entity';
import { UserService } from '@/user/service/user.service';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { LocalStrategy } from './strategies/local-strategy';
import { JwtStrategy } from './strategies/jwt-strategy';
import { RefreshJwtStrategy } from './strategies/refresh-jwt-strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      // TODO get secret from  process.env.JWT_SECRET, but it is undefined
      secret: `Vit8SWv4pYZT4UWWhS/vFqwfK0e/n5KQIvi2/IEhyFw=`,
    }),
  ],
  controllers: [AuthController],
  providers: [
    LocalStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
    AuthService,
    UserService,
  ],
})
export class AuthModule {}
