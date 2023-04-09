import { Injectable } from '@nestjs/common'
import { Entity } from '@shared/interfaces/response.interface'
import { BaseService } from '@sharedServices/base.service'
import { Connection, Repository } from 'typeorm'
import { CommentEntity } from '../entities/comment.entity'
import { CommentRepository } from '../repositories/comment.repository'

@Injectable()
export class CommentService extends BaseService {
  public repository: Repository<CommentEntity>
  public entity: Entity = CommentEntity
  constructor(private connection: Connection, private post: Connection) {
    super()
    this.repository = this.connection.getCustomRepository(CommentRepository)
  }
}
