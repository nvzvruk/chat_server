import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ormconfig } from 'ormconfig';
import { UserModule } from '@/user/user.module';
import { MessageModule } from '@/message/message.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(ormconfig),
    UserModule,
    MessageModule,
    AuthModule,
  ],
})
export class AppModule {}
