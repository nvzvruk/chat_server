import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { JwtGuard } from '@/auth/guards/jwt-guard';
import { User } from '@/user/user.entity';
import { MessageService } from '../service/message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messagesService: MessageService) {}

  @Post()
  create(@Body() { user, text }: { user: User; text: string }) {
    return this.messagesService.create(text, user);
  }

  @UseGuards(JwtGuard)
  @Get('all')
  findAll() {
    return this.messagesService.findAll();
  }
}
