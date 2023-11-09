import { Injectable } from '@nestjs/common';
import { MessageDTO } from '../dto/get-message.dto';
import { fakeMessages } from '../fake-data';

@Injectable()
export class MessageService {
  private readonly messages: MessageDTO[] = fakeMessages;

  create(message: MessageDTO): MessageDTO {
    this.messages.push(message);
    return message;
  }

  findAll(): MessageDTO[] {
    return this.messages;
  }

  findOne(id: number): MessageDTO {
    return this.messages[id];
  }

  update(id: number, message: MessageDTO): MessageDTO {
    this.messages[id] = message;
    return message;
  }

  remove(id: number): void {
    this.messages.splice(id, 1);
  }
}
