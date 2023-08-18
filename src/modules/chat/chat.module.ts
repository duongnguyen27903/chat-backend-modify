import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Groups, Maps } from 'src/entity/groups.entity';
import { Users } from 'src/entity/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Groups, Maps, Users])],
  providers: [ChatGateway, ChatService]
})
export class ChatModule { }
