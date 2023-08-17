import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Groups } from 'src/entity/groups.entity';
import { Repository } from 'typeorm';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
export class ChatService {
  @WebSocketServer() server: Server;
  constructor(
    @InjectRepository(Groups) private readonly groups: Repository<Groups>
  ) { }

  async load_groups() {

  }

}
