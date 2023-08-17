import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Groups } from 'src/entity/groups.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Groups])],
  providers: [ChatGateway, ChatService]
})
export class ChatModule { }
