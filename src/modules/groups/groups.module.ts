import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Groups, Maps } from 'src/entity/groups.entity';
import { Users } from 'src/entity/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Groups, Maps, Users])
  ],
  controllers: [GroupsController],
  providers: [GroupsService]
})
export class GroupsModule { }
