import { RoleTransformer } from '@authModule/transformers/role.transformer'
import { Entity, ResponseEntity } from '@shared/interfaces/response.interface'
import { Transformer } from '@shared/transformers/transformer'
import { UserEntity } from '../entities/user.entity'

export class UserTransformer extends Transformer {
  transform(model: UserEntity): ResponseEntity {
    return {
      id: model.id,
      email: model.email,
      username: model.username,
      firstName: model.firstName,
      lastName: model.lastName,
      status: model.status,
      socketId: model.socketId,
      refreshToken: model.refreshToken,
      verified: model.verified,
      verifiedAt: model.verifiedAt,
      deletedAt: model.deletedAt,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    }
  }

  includeRoles(model: UserEntity): Entity[] {
    return this.collection(model.roles, new RoleTransformer())
  }
}
