import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'ormconfig';
import { UserModule } from '@/user/user.module';
import { MessageModule } from '@/message/message.module';

@Module({
  imports: [UserModule, MessageModule, TypeOrmModule.forRoot(config)],
})
export class AppModule {}
