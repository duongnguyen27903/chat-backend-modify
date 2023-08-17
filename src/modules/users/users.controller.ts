import { Controller, } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { Users } from 'src/entity/users.entity';
@ApiTags('users-profile')
// @Roles(UserRoles.ADMIN)
@Crud({
  model: {
    type: Users
  },
  routes: {
    only: ['getManyBase', 'getOneBase', 'updateOneBase', 'deleteOneBase']
  },
  params: {
    id: {
      field: 'id',
      type: 'uuid',
      primary: true,
    },
  },
})
@Controller('users-profile')
export class UsersController {
  constructor(public service: UsersService) { }
}
