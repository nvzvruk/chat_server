import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Query,
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
  @Get('history')
  findPaginated(
    @Query('pageNumber') pageNumber = 1,
    @Query('pageSize') pageSize = 20,
  ) {
    return this.messagesService.findPaginated({ pageNumber, pageSize });
  }
}
