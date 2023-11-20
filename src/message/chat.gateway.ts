import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './service/message.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessageService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() { text, userId },
    @ConnectedSocket() socket: Socket,
  ) {
    const { id } = await this.messageService.create(text, userId);
    const message = await this.messageService.findOne(id);
    socket.emit('receive_message', message);
    return message;
  }

  @SubscribeMessage('request_all_messages')
  async requestAllMessages(@ConnectedSocket() socket: Socket) {
    const messages = await this.messageService.findAll();

    socket.emit('receive_all_messages', messages);
    return messages;
  }
}
