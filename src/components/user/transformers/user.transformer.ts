import { Transformer } from '@shared/transformers/transformer'
import { RoleTransformer } from '@authModule/transformers/role.transformer'
import { UserEntity } from '../entities/user.entity'

export class UserTransformer extends Transformer {
  transform(model: UserEntity): any {
    return {
      id: model.id,
      email: model.email,
      username: model.username,
      firstName: model.firstName,
      lastName: model.lastName,
      status: model.status,
      socketId: model.socketId,
      verified: model.verified,
      verifiedAt: model.verifiedAt,
      deletedAt: model.deletedAt,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }

  includeRoles(model: UserEntity): any {
    return this.collectionWithoutDataObj(model.roles, new RoleTransformer())
  }
}
