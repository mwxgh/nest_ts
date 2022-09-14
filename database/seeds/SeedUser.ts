import { Connection } from 'typeorm';
import { UserEntity } from '../../src/components/user/entities/user.entity';
import { HashService } from '../../src/shared/services/hash/hash.service';
import { Role } from '../../src/components/auth/entities/role.entity';
import * as _ from 'lodash';

export default class UsersTableSeeder {
  public hashService: HashService;
  constructor() {
    this.hashService = new HashService();
  }
  async up(connection: Connection): Promise<any> {
    const roles = await connection.getRepository(Role).find();

    const seed = [
      {
        email: 'superadmin@mwx.com',
        username: 'superadmin',
        password: this.hashService.hash('secret'),
        status: 'ACTIVE',
        role: 'superadmin',
      },
      {
        email: 'admin@mwx.com',
        username: 'admin',
        password: this.hashService.hash('secret'),
        status: 'ACTIVE',
        role: 'admin',
      },
      {
        email: 'user@mwx.com',
        username: 'user',
        password: this.hashService.hash('secret'),
        status: 'ACTIVE',
        role: 'user',
      },
    ];
    const users = seed.map((item) => {
      const user = new UserEntity();

      user.email = item.email;
      user.username = item.username;
      user.password = item.password;
      user.status = item.status;
      user.roles = _.filter(roles, { slug: item.role });

      return user;
    });
    await connection.manager.save(users);
  }
}
