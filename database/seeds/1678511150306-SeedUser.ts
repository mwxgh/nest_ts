import { filter } from 'lodash'
import { Connection } from 'typeorm'
import { RoleEntity } from '../../src/components/auth/entities/role.entity'
import {
  UserEntity,
  UserStatus,
} from '../../src/components/user/entities/user.entity'
import { HashService } from '../../src/shared/services/hash/hash.service'

export default class UsersTableSeeder {
  public hashService: HashService
  constructor() {
    this.hashService = new HashService()
  }
  async up(connection: Connection): Promise<void> {
    const roles = await connection.getRepository(RoleEntity).find()

    const seed = [
      {
        email: 'admin@gmail.com',
        username: 'admin',
        password: this.hashService.hash('secret'),
        status: UserStatus.active,
        role: 'admin',
      },
      {
        email: 'user@gmail.com',
        username: 'user',
        password: this.hashService.hash('secret'),
        status: UserStatus.active,
        role: 'user',
      },
    ]
    const users = seed.map((item) => {
      const user = new UserEntity()

      user.email = item.email
      user.username = item.username
      user.password = item.password
      user.status = item.status
      user.roles = filter(roles, { slug: item.role })

      return user
    })
    await connection.manager.save(users)
  }
}
