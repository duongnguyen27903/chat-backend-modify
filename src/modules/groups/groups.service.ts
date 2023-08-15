import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from 'typeorm';
import { GroupRoles, Groups, Maps } from 'src/entity/groups.entity';
import { Users } from 'src/entity/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GroupsService {
    constructor(
        @InjectRepository(Groups) private readonly groups: Repository<Groups>,
        @InjectRepository(Maps) private readonly maps: Repository<Maps>,
        @InjectRepository(Users) private readonly users: Repository<Users>
    ) { }

    async create_2_member_group(creator: string, member: string, name: string) {
        const check_member = await this.users.findOne({
            where: {
                id: member
            }
        })
        const check_creator = await this.users.findOne({
            where: {
                id: creator
            }
        })
        if (!check_creator || !check_member) {
            return new BadRequestException('User is not existed, please try again')
        }
        if (!!check_member && !!check_creator) {
            const create_group = await this.groups
                .createQueryBuilder()
                .insert()
                .into(Groups)
                .values({
                    name: name
                })
                .execute()
            const create_map_creator = await this.maps
                .createQueryBuilder()
                .insert()
                .into(Maps)
                .values({
                    group: create_group['generatedMaps'][0]['id'],
                    user: creator,
                    group_role: GroupRoles.ADMIN
                })
                .execute()
            const create_map_member = await this.maps
                .createQueryBuilder()
                .insert()
                .into(Maps)
                .values({
                    group: create_group['generatedMaps'][0]['id'],
                    user: member,
                    group_role: GroupRoles.ADMIN
                })
                .execute();
            try {
                Promise.all([create_group, create_map_creator, create_map_member]);
                return "Create group successfully";
            } catch (error) {
                return new BadRequestException('Cannot create groups, you can try again')
            }
        }
    }

    async create_multi_member_group(creator: string, member: string[], name: string) {
        const check_creator = await this.users.findOne({
            where: {
                id: creator
            }
        });
        if (!check_creator) {
            return new BadRequestException('Cannot create group, please try again')
        }
        for (let mem of member) {
            const check_member = await this.users.findOne({
                where: {
                    id: mem
                }
            })
            if (!check_member) {
                return new BadRequestException(`There is no user like that, you can try again`)
            }
        }

        const create_group = await this.groups
            .createQueryBuilder()
            .insert()
            .into(Groups)
            .values({
                name: name
            })
            .execute();
        const create_map_creator = await this.maps
            .createQueryBuilder()
            .insert()
            .into(Maps)
            .values({
                user: creator,
                group: create_group['generatedMaps'][0]['id'],
                group_role: GroupRoles.ADMIN
            })
            .execute();

        let promises = [];
        for (let mem of member) {
            const create_map_member = await this.maps
                .createQueryBuilder()
                .insert()
                .into(Maps)
                .values({
                    user: mem,
                    group: create_group.generatedMaps[0].id,
                    group_role: GroupRoles.MEMBER
                })
                .execute();
            promises.push(create_map_member);
        }
        try {
            Promise.all([create_group, create_map_creator, promises]);
            return "Create group successfully"
        } catch (error) {
            return new BadRequestException('Cannot create group, please try again and assure your internet connection')
        }
    }

    async find_user(name: string) {
        const users = await this.users.find({
            where: {
                name: Like(`%${name}%`)
            }
        })
        return users
    }

    async in_group(id: string) {
        const group = await this.maps
            .createQueryBuilder('maps')
            .leftJoinAndSelect('maps.group', 'group')
            .leftJoinAndSelect('maps.user', 'user')
            .where('user.id = :id', { id: id })
            .execute();
        return group;
    }

    async get_all_groups() {
        const all_groups = await this.groups.find();
        return all_groups;
    }

    async delete_group(group: string) {
        const delete_map_group = await this.maps.delete({ group: group })
        const delete_group = await this.groups.delete({ id: group })
        try {
            Promise.all([delete_map_group, delete_group]);
            return "Delete group successfully";
        } catch (error) {
            return new BadRequestException('Cannot delete group, please try again and assure your internet connection')
        }
    }

    async update_group(id: string, name: string) {
        try {
            const update = await this.groups.createQueryBuilder()
                .update(Groups)
                .set({
                    name: name,
                })
                .where('id = :id', { id: id })
                .execute();
            return update;
        } catch (error) {
            return new BadRequestException('Cannot rename group, please try again and assure your internet connection')
        }
    }

    async set_nickname(user: string, group: string, nickname: string) {
        try {
            const set_nickname = await this.maps
                .createQueryBuilder()
                .update(Maps)
                .set({
                    nickname: nickname
                })
                .where('user = :user', { user: user })
                .andWhere('group = :group', { group: group })
                .execute();
            return set_nickname;
        } catch (error) {
            return new BadRequestException('Cannot set your nickname, please try again and assure your internet connection')
        }

    }
}