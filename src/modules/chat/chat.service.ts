import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Groups, Maps } from 'src/entity/groups.entity';
import { Repository } from 'typeorm';
import { Users } from 'src/entity/users.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Groups) private readonly groups: Repository<Groups>,
    @InjectRepository(Maps) private readonly maps: Repository<Maps>,
    @InjectRepository(Users) private readonly users: Repository<Users>
  ) { }


  async join(id: string) {

  }

  async load_groups(id: string) {
    const groups = await this.maps
      .createQueryBuilder('maps')
      .leftJoinAndSelect('maps.group', 'group')
      .leftJoinAndSelect('maps.user', 'user')
      .where('user.id = :id', { id: id })
      .select(['group.name', 'group.id', 'group.createAt', 'group.messages', 'maps.*'])
      .execute();
    return groups;
  }

  async load_messages(id: string) {
    const messages = await this.groups.findOne({
      where: {
        id: id
      },
    })
    return messages;
  }

  async send_message({ id, sender, content, send_at, tags }: CreateChatDto) {
    const check_sender = await this.users.findOne({
      where: {
        id: sender
      },
      select: {
        id: true,
        email: true,
        name: true,
      }
    })

    if (!check_sender) {
      return "Something wrong, please try again"
    }

    const get_messages = await this.groups.findOne({
      where: {
        id: id
      },
    })

    let add_message = [...get_messages.messages, {
      sender: sender,
      name: check_sender.name,
      content: content,
      tags: tags,
      send_at: send_at
    }];

    const update_message = await this.groups
      .createQueryBuilder()
      .update(Groups)
      .set({
        messages: add_message
      })
      .where('id = :id', { id: id })
      .execute();

    const new_message = {
      sender: sender,
      name: check_sender.name,
      content: content,
      tags: tags,
      send_at: send_at
    }

    try {
      Promise.all([check_sender, get_messages, add_message, update_message]);
      return new_message;
    } catch (error) {
      return new BadRequestException('Cannot send message, please try again and assure your internet connection')
    }
  }

}
