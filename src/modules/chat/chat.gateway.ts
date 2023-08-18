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
    @ConnectedSocket() client: Socket//lấy ra toàn bộ thông tin kết nối socket của client đến server
  ) {
    const groups = await this.chatService.load_groups(id);

    let joinRooms = []
    groups.forEach((group: any) => {
      joinRooms.push(group.group_id)
    });
    if (groups) {
      client.join(id)//tạo room là id của user chứa kết nối socket hiện tại 
    }
    client.join(joinRooms);//tạo nhiều room chứa kết nối đến socket hiện tại
    return this.server.to(id).emit('groups', groups)// to(id) là emit một event đến room(id)
  }

  @SubscribeMessage('load_messages')
  async load_messages(
    @MessageBody('id') id: string
  ) {
    const messages = await this.chatService.load_messages(id);
    if (messages) {
      return this.server.to(id).emit('messages', messages);
    }
  }

  @SubscribeMessage('send_message')
  async send_message(
    @MessageBody() body: CreateChatDto
  ) {
    const new_message = await this.chatService.send_message(body);
    return this.server.to(body.id).emit('new_message', new_message);
  }
}
