import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MessageService } from '../service/message.service';
import { MessageDTO } from '../dto/get-message.dto';

@Controller('messages')
export class MessageController {
  constructor(private readonly messagesService: MessageService) {}

  @Post()
  create(@Body() message: MessageDTO): MessageDTO {
    return this.messagesService.create(message);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(): MessageDTO[] {
    return this.messagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): MessageDTO {
    return this.messagesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() message: MessageDTO): MessageDTO {
    return this.messagesService.update(id, message);
  }

  @Delete(':id')
  remove(@Param('id') id: number): void {
    this.messagesService.remove(id);
  }
}
