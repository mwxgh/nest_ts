import { PasswordResetEntity } from '@authModule/entities/passwordReset.entity'
import { PasswordResetRepository } from '@authModule/repositories/passwordReset.repository'
import { Injectable } from '@nestjs/common'
import { BaseService } from '@sharedServices/base.service'
import { HashService } from '@sharedServices/hash/hash.service'
import { Connection, Repository } from 'typeorm'

@Injectable()
export class InviteUserService extends BaseService {
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
   * @param email string
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
   * @param email string
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
   * Generate new password reset token
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
   * Check is expireds
   *
   * @param entity
   */
  isExpired(entity: PasswordResetEntity): boolean {
    const currentTime = new Date()
    return currentTime > new Date(entity.expire)
  }
}
