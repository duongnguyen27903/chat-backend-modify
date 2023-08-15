import { Body, Controller, Get, Post, Query, Patch, Delete } from '@nestjs/common';
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

  @Get('in_group')
  async in_group(
    @Query('id') id: string
  ) {
    return await this.groupsService.in_group(id);
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
    @Query('id') id: string
  ) {
    return await this.groupsService.delete_group(id);
  }

  @Patch('set_nickname')
  async set_nickname(
    @Query('user') user: string,
    @Query('group') group: string,
    @Query('nickname') nickname: string
  ) {
    return await this.groupsService.set_nickname(user, group, nickname);
  }
}
