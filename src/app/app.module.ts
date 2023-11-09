import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'ormconfig';
import { UserModule } from '@/user/user.module';
import { MessageModule } from '@/message/message.module';
import { AppController } from './controller/app.controller';
import { AppService } from './app.service';

@Module({
  imports: [UserModule, MessageModule, TypeOrmModule.forRoot(config)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
