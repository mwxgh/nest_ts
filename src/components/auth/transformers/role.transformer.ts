import { Transformer } from '@shared/transformers/transformer'
import { RoleEntity } from '../entities/role.entity'
import { PermissionTransformer } from './permission.transformer'

export class RoleTransformer extends Transformer {
  transform(model) {
    return {
      id: model.id,
      name: model.name,
      slug: model.slug,
      level: model.level,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      deletedAt: model.deletedAt,
    }
  }
  includePermissions(model: RoleEntity): any {
    return this.collection(model.permissions, new PermissionTransformer())
  }
}
