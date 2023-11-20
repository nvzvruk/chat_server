import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtGuard } from '@/auth/guards/jwt-guard';
import { MessageService } from '../service/message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messagesService: MessageService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(@Request() request, @Body() { text }) {
    return this.messagesService.create(text, request.user.sub);
  }

  @UseGuards(JwtGuard)
  @Get('all')
  findAll() {
    return this.messagesService.findAll();
  }
}
