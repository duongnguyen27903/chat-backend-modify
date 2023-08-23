import { Body, Controller, Get, Post, Query, Patch, Delete, Param } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) { }

  @Post('create_2_member_group')
  async create_2_member_group(
    @Query('creator') creator: string,
    @Query('member') member: string,
    @Query('name') name: string
  ) {
    return await this.groupsService.create_2_member_group(creator, member, name);
  }

  @Post('create_multi_member_group')
  async create_multi_member_group(
    @Query('creator') creator: string,
    @Query('name') name: string,
    @Body() member: string[]
  ) {
    return await this.groupsService.create_multi_member_group(creator, member, name);
  }

  @Get('get_all_groups')
  async get_all_groups() {
    return await this.groupsService.get_all_groups();
  }

  @Get('find_user')
  async find_user(
    @Query('name') name: string
  ) {
    return await this.groupsService.find_user(name);
  }

  @Get('group_of_user')
  async in_group(
    @Query('id') id: string
  ) {
    return await this.groupsService.group_of_user(id);
  }

  @Patch('update_group')
  async update_group(
    @Query('id') id: string,
    @Query('name') name: string
  ) {
    return await this.groupsService.update_group(id, name);
  }

  @Delete('delete_group')
  async delete_group(
    @Query('group') group: string
  ) {
    return await this.groupsService.delete_group(group);
  }

  @Patch('set_nickname')
  async set_nickname(
    @Query('user') user: string,
    @Query('group') group: string,
    @Query('nickname') nickname: string
  ) {
    return await this.groupsService.set_nickname(user, group, nickname);
  }

  @Get('users_in_group/:id')
  async users_in_group(@Param('id') id: string) {
    return await this.groupsService.users_in_group(id);
  }

  @Delete('/remove_user')
  async remove_user(
    @Query('host') host: string,
    @Query('user') user: string,
    @Query('group') group: string
  ) {
    return await this.groupsService.remove_user_from_group(host, user, group);
  }

  @Post('/add_user')
  async add_user(
    @Query('user') user: string,
    @Query('group') group: string
  ) {
    return await this.groupsService.add_user_to_group(user, group);
  }
}
