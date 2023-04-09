import { Injectable } from '@nestjs/common'
import { Entity } from '@shared/interfaces/response.interface'
import { BaseService } from '@sharedServices/base.service'
import { Connection, Repository, SelectQueryBuilder } from 'typeorm'
import { CommentEntity, JoinCommentAble } from '../entities/comment.entity'
import { CommentRepository } from '../repositories/comment.repository'

@Injectable()
export class CommentService extends BaseService {
  public repository: Repository<CommentEntity>
  public entity: Entity = CommentEntity
  constructor(private connection: Connection, private post: Connection) {
    super()
    this.repository = this.connection.getCustomRepository(CommentRepository)
  }

  async joinComment(): Promise<SelectQueryBuilder<CommentEntity>> {
    const values = Object.values(JoinCommentAble)
    const keys = Object.keys(JoinCommentAble)
    let data = this.repository.createQueryBuilder('comments')
    for (let i = 0; i < keys.length; i++) {
      data = data.leftJoinAndSelect(`${values[`${i}`]}`, `${keys[`${i}`]}`)
    }
    return data
  }
}
