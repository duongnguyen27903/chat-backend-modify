import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Users } from 'src/entity/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService extends TypeOrmCrudService<Users> {
    constructor(@InjectRepository(Users) services: Repository<Users>) {
        super(services)
    }
}
