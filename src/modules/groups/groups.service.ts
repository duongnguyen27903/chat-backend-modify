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
                return create_group['generatedMaps'][0]
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
            return create_group['generatedMaps'][0]
        } catch (error) {
            return new BadRequestException('Cannot create group, please try again and assure your internet connection')
        }
    }

    async find_user(name: string) {
        if (name !== "") {
            const users = await this.users.find({
                where: {
                    name: Like(`%${name}%`)
                }
            })
            return users
        }

        else return []

    }

    async group_of_user(id: string) {
        const group = await this.maps
            .createQueryBuilder('maps')
            .leftJoinAndSelect('maps.group', 'group')
            .leftJoinAndSelect('maps.user', 'user')
            .where('user.id = :id', { id: id })
            .select(['group.name', 'group.id', 'group.createAt', 'group.message', 'maps.*'])
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

    async users_in_group(id: string) {
        const all_users = await this.maps
            .createQueryBuilder('maps')
            .leftJoinAndSelect('maps.user', 'user')
            .leftJoinAndSelect('maps.group', 'group')
            .where('group.id = :id', { id: id })
            .select(['maps.*', 'user.name'])
            .execute()
        return all_users;
    }

    async remove_user_from_group(host: string, user: string, group: string) {

        const check_host = await this.maps
            .createQueryBuilder('maps')
            .leftJoinAndSelect('maps.user', 'user')
            .leftJoinAndSelect('maps.group', 'group')
            .where('group.id = :group', { group: group })
            .andWhere('user.id = :host', { host: host })
            .andWhere('maps.group_role = :role', { role: GroupRoles.ADMIN })
            .execute()
        if (!check_host || check_host.length === 0) {
            return new BadRequestException('You are not the owner of the group')
        }
        try {

            const remove = await this.maps.delete({
                user: user,
                group: group,
            })
            return remove;
        } catch (error) {
            return new BadRequestException('Cannot remove user, please try again')
        }
    }
    async add_user_to_group(user: string, group: string) {
        const check_user = await this.users.findOne({
            where: {
                id: user
            }
        })
        const check_group = await this.groups.findOne({
            where: {
                id: group
            }
        })
        const check_map = await this.maps
            .createQueryBuilder('maps')
            .leftJoinAndSelect('maps.user', 'user')
            .leftJoinAndSelect('maps.group', 'group')
            .where('group.id = :group', { group: group })
            .andWhere('user.id = :user', { user: user })
            .execute()

        if (!check_user || !check_group || check_map.length !== 0) {
            return "Cannot add user"
        }
        const add_user = await this.maps.createQueryBuilder()
            .insert()
            .into(Maps)
            .values({
                user: check_user.id,
                group: check_group.id,
                group_role: GroupRoles.MEMBER
            })
            .execute();

        try {
            Promise.all([add_user]);
            return add_user.generatedMaps[0]
        } catch (error) {
            return new BadRequestException("Cannot add user")
        }
    }
}
