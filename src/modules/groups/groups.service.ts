import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
}
