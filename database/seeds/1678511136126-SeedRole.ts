import { Connection } from 'typeorm'
import { RoleEntity } from '../../src/components/auth/entities/role.entity'
import { filter } from 'lodash'
import { PermissionEntity } from '../../src/components/auth/entities/permission.entity'

export default class RolesTableSeeder {
  async up(connection: Connection): Promise<void> {
    const permissions = await connection.getRepository(PermissionEntity).find()

    const seed = [
      { name: 'Admin', slug: 'admin', permissions: 'crud' },
      { name: 'User', slug: 'user', permissions: 'read_only' },
    ]

    const roles = seed.map((item) => {
      const role = new RoleEntity()
      role.name = item.name
      role.slug = item.slug
      role.permissions = filter(permissions, { slug: item.permissions })

      return role
    })

    await connection.manager.save(roles)
  }
}
