import { Connection } from 'typeorm';
import { Role } from '../../src/components/auth/entities/role.entity';

export default class RolesTableSeeder {
  async up(connection: Connection): Promise<any> {
    const seed = [
      { name: 'Super Admin', slug: 'superadmin' },
      { name: 'Admin', slug: 'admin' },
      { name: 'User', slug: 'user' },
    ];

    const roles = seed.map((item) => {
      const role = new Role();
      role.name = item.name;
      role.slug = item.slug;
      return role;
    });

    await connection.manager.save(roles);
  }
}
