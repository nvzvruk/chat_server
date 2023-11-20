import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from './service/message.service';
import { MessageController } from './controller/message.controller';
import { Message } from './message.entity';
import { ChatGateway } from '@/message/chat.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  controllers: [MessageController],
  providers: [ChatGateway, MessageService],
})
export class MessageModule {}
