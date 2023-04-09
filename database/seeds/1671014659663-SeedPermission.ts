import { Connection } from 'typeorm'
import { PermissionEntity } from '../../src/components/auth/entities/permission.entity'

export default class PermissionsTableSeeder {
  async up(connection: Connection): Promise<void> {
    const seed = [
      { name: 'CRUD', slug: 'crud' },
      { name: 'Read Only', slug: 'read_only' },
    ]

    const permissions = seed.map((item) => {
      const permission = new PermissionEntity()
      permission.name = item.name
      permission.slug = item.slug
      return permission
    })

    await connection.manager.save(permissions)
  }
}
