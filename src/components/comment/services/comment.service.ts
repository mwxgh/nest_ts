import {
  CreateCommentDto,
  UpdateCommentDto,
} from '@commentModule/dto/comment.dto'
import { BadRequestException, Injectable } from '@nestjs/common'
import { Entity } from '@shared/interfaces/response.interface'
import { BaseService } from '@sharedServices/base.service'
import { Me } from '@userModule/dto/user.dto'
import { assign, isNil } from 'lodash'
import { Connection, Repository } from 'typeorm'
import { CommentEntity, CommentStatus } from '../entities/comment.entity'
import { CommentRepository } from '../repositories/comment.repository'

@Injectable()
export class CommentService extends BaseService {
  public repository: Repository<CommentEntity>
  public entity: Entity = CommentEntity
  constructor(private connection: Connection, private post: Connection) {
    super()
    this.repository = this.connection.getCustomRepository(CommentRepository)
  }

  async createComment({
    currentUser,
    data,
  }: {
    currentUser: Me
    data: CreateCommentDto
  }): Promise<CommentEntity> {
    const checkUser = this.checkRoleUserOnly(currentUser)

    if (checkUser === true) {
      Object.assign(data, { status: CommentStatus.pending })
    }

    if (!isNil(data.parentId)) {
      const parentComment: CommentEntity = await this.findOneOrFail(
        data.parentId,
      )
      if (parentComment.postId !== data.postId) {
        throw new BadRequestException(
          'Parent comment and child comment not belong to one post',
        )
      }
    }

    return this.create(assign(data, { userId: currentUser.id }))
  }

  async updateComment({
    id,
    currentUser,
    data,
  }: {
    id: number
    currentUser: Me
    data: UpdateCommentDto
  }): Promise<CommentEntity> {
    const comment: CommentEntity = await this.findOneOrFail(id)

    this.checkUserOperation({ currentUser, userId: comment.userId })

    return this.update(id, data)
  }

  async deleteComment({
    id,
    currentUser,
  }: {
    id: number
    currentUser: Me
  }): Promise<void> {
    const comment: CommentEntity = await this.findOneOrFail(id)

    this.checkRoleOperation({ currentUser, userId: comment.userId })

    await this.destroy(id)
  }
}
