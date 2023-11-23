import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessageService } from './service/message.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessageService) {}

  handleConnection(): any {}

  @SubscribeMessage('send_message')
  async listenForMessages(@MessageBody() { text, userId }) {
    // TODO Research about get id from cookie etc.
    const { id } = await this.messageService.create(text, userId);
    const message = await this.messageService.findOne(id);
    this.server.emit('receive_message', message);
    return message;
  }
}
