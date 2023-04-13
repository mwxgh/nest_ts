import {
  ResetPasswordDto,
  SendResetLinkDto,
} from '@authModule/dto/forgotPassword.dto'
import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common'
import { Entity } from '@shared/interfaces/response.interface'
import { BaseService } from '@sharedServices/base.service'
import { HashService } from '@sharedServices/hash/hash.service'
import { UserEntity } from '@userModule/entities/user.entity'
import { UserService } from '@userModule/services/user.service'
import { Connection, MoreThan, Repository } from 'typeorm'
import { PasswordResetEntity } from '../entities/passwordReset.entity'
import { PasswordResetRepository } from '../repositories/passwordReset.repository'

@Injectable()
export class PasswordResetService extends BaseService {
  public repository: Repository<PasswordResetEntity>
  public entity: Entity = PasswordResetEntity

  constructor(
    private connection: Connection,
    private hashService: HashService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {
    super()
    this.repository = connection.getCustomRepository(PasswordResetRepository)
  }

  /**
   * Expire given token
   *
   * @param token string
   */
  async expire(token: string): Promise<void> {
    await this.update({ where: { token } }, { expired: new Date() })
  }

  /**
   * Expire all token of an email
   *
   * @param token string
   */
  async expireAllToken(email: string): Promise<void> {
    const now = new Date()

    await this.bulkUpdate(
      { where: { email, expire: MoreThan(now.getTime()) } },
      { expire: now },
    )
  }

  /**
   * Create new password reset token
   *
   * @param email string
   */
  async generate(email: string): Promise<PasswordResetEntity> {
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
    const currentTime = new Date()
    return currentTime > new Date(entity.expire)
  }

  /**
   * Request reset password
   *
   * @param email : string
   *
   * @returns UserEntity
   * @returns PasswordResetEntity
   */
  async requestResetPassword(
    data: SendResetLinkDto,
  ): Promise<[UserEntity, PasswordResetEntity]> {
    const { email } = data
    const user: UserEntity = await this.userService.firstOrFail({
      where: { email: this.sanitize(email) },
    })

    await this.expireAllToken(user.email)

    const passwordReset: PasswordResetEntity = await this.generate(user.email)

    return [user, passwordReset]
  }

  /**
   * Reset password
   *
   * @param token : string
   * @param password : string
   *
   * @returns UserEntity
   */

  async resetPassword(data: ResetPasswordDto): Promise<UserEntity> {
    const { token, password } = data
    const passwordReset: PasswordResetEntity = await this.firstOrFail({
      where: { token },
    })

    if (this.isExpired(passwordReset)) {
      throw new BadRequestException('Token is expired')
    } else {
      await this.expire(token)
    }

    const user: UserEntity = await this.userService.firstOrFail({
      where: { email: passwordReset.email },
    })

    await this.userService.changePassword(user.id, password)

    return user
  }
}
