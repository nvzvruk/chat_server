import { Controller, Get, Post, Body } from '@nestjs/common';
import { User } from '@/user/user.entity';
import { MessageService } from '../service/message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messagesService: MessageService) {}

  @Post()
  create(@Body() { user, text }: { user: User; text: string }) {
    return this.messagesService.create(text, user);
  }

  @Get('all')
  findAll() {
    return this.messagesService.findAll();
  }
}
