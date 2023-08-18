import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.entity";

@Entity({ name: 'groups' })
export class Groups {
    @PrimaryGeneratedColumn('uuid')
    id: string
    @Column()
    name: string
    @CreateDateColumn()
    createAt: Date
    @Column({ type: 'json', default: [] })
    messages: any

    @OneToMany(() => Maps, (map_group) => map_group.id)
    map_group: Maps[]
}

export enum GroupRoles {
    ADMIN = 'admin',
    MEMBER = 'member'
}

@Entity('maps')
export class Maps {
    @PrimaryGeneratedColumn('rowid')
    id: number
    @ManyToOne(() => Users, (user) => user.id)
    user: string
    @ManyToOne(() => Groups, (group) => group.id)
    group: string
    @Column({ type: 'enum', enum: GroupRoles })
    group_role: string
    @Column({ nullable: true })
    nickname: string
}