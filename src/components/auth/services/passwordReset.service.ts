import { Injectable } from '@nestjs/common'
import { BaseService } from '@sharedServices/base.service'
import { HashService } from '@sharedServices/hash/hash.service'
import { Connection, Repository } from 'typeorm'
import { PasswordResetEntity } from '../entities/passwordReset.entity'
import { PasswordResetRepository } from '../repositories/passwordReset.repository'

@Injectable()
export class PasswordResetService extends BaseService {
  public repository: Repository<any>
  public entity: any = PasswordResetEntity

  constructor(
    private connection: Connection,
    private hashService: HashService,
  ) {
    super()
    this.repository = connection.getCustomRepository(PasswordResetRepository)
  }

  /**
   * Expire given token
   *
   * @param token string
   */
  async expire(token: string): Promise<any> {
    await this.repository
      .createQueryBuilder('passwordReset')
      .update(this.entity)
      .set({ expire: () => 'NOW()' })
      .where('token = :token', { token })
      .execute()
  }

  /**
   * Expire all token of an email
   *
   * @param token string
   */
  async expireAllToken(email: string): Promise<any> {
    await this.repository
      .createQueryBuilder('passwordReset')
      .update(this.entity)
      .set({ expire: () => 'NOW()' })
      .where('email = :email', { email })
      .andWhere('expire >= NOW()')
      .execute()
  }

  /**
   * Create new password reset token
   *
   * @param email string
   */
  async generate(email: string): Promise<any> {
    return await this.create({
      email: email,
      token: this.hashService.md5(new Date().toISOString()),
    })
  }

  /**
   * Determine
   *
   * @param entity
   */
  isExpired(entity: PasswordResetEntity): boolean {
    const current_time = new Date()
    return current_time > new Date(entity.expire)
  }
}
