import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/shared/services/base.service';
import { Connection, Repository } from 'typeorm';
import { Comment, JoinCommentAble } from '../entities/comment.entity';
import { CommentRepository } from '../repositories/comment.repository';

@Injectable()
export class CommentService extends BaseService {
  public repository: Repository<any>;
  public entity: any = Comment;
  constructor(private dataSource: Connection, private post: Connection) {
    super();
    this.repository = this.dataSource.getCustomRepository(CommentRepository);
  }

  async comment(): Promise<any> {
    return await this.repository;
  }

  async joinComment() {
    const values = Object.values(JoinCommentAble);
    const keys = Object.keys(JoinCommentAble);
    let data = this.repository.createQueryBuilder('comments');
    for (let i = 0; i < keys.length; i++) {
      data = data.leftJoinAndSelect(`${values[`${i}`]}`, `${keys[`${i}`]}`);
    }
    return data;
  }
}
