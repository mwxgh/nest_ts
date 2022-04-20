import { Injectable } from '@nestjs/common';
import { Connection, Repository } from 'typeorm';
import { BaseService } from '../../../shared/services/base.service';
import { Option } from '../entities/option.entity';
import { OptionRepository } from '../repositories/option.repository';

@Injectable()
export class OptionService extends BaseService {
  public repository: Repository<any>;
  public entity: any = Option;

  constructor(private connection: Connection) {
    super();
    this.repository = this.connection.getCustomRepository(OptionRepository);
  }
}
