import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
@WebSocketGateway({})
export class ChatGateway {
  constructor(private readonly chatService: ChatService) { }

  @WebSocketServer() server: Server;

  @SubscribeMessage('load_groups')
  async load_groups(
    @MessageBody('id') id: string,
    @ConnectedSocket() client: Socket
  ) {
    console.log(client);

    const groups = await this.chatService.load_groups(id);
    return this.server.emit('groups', groups)
  }

  @SubscribeMessage('load_messages')
  async load_messages(
    @MessageBody('id') id: string
  ) {
    const messages = await this.chatService.load_messages(id);
    return this.server.emit('messages', messages)
  }

  @SubscribeMessage('send_message')
  async send_message(
    @MessageBody() body: CreateChatDto
  ) {
    const new_message = await this.chatService.send_message(body);
    return this.server.emit('new_message', new_message);
  }
}
