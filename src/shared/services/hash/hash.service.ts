import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'

@Injectable()
export class HashService {
  public saltRounds = 10

  hash(data: string): string {
    return bcrypt.hashSync(data, bcrypt.genSaltSync(this.saltRounds), null)
  }

  compare(data: string, hash: string): boolean {
    return bcrypt.compareSync(data, hash)
  }

  md5(data: any): string {
    return crypto.createHash('md5').update(data).digest('hex')
  }
}
