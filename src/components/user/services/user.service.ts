import { UserRegisterDto } from '@authModule/dto/auth.dto'
import { PasswordResetEntity } from '@authModule/entities/passwordReset.entity'
import { PasswordResetService } from '@authModule/services/passwordReset.service'
import { RoleService } from '@authModule/services/role.service'
import { UserRoleService } from '@authModule/services/userRole.service'
import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { DEFAULT_USER_STATUS } from '@shared/defaultValue/defaultValue'
import { Entity } from '@shared/interfaces/response.interface'
import { BaseService } from '@sharedServices/base.service'
import { HashService } from '@sharedServices/hash/hash.service'
import { isNil, pick } from 'lodash'
import { Connection, Repository } from 'typeorm'
import { CreateUserDto, InviteUserDto, UpdateUserDto } from '../dto/user.dto'
import { UserEntity } from '../entities/user.entity'
import { UserRepository } from '../repositories/user.repository'

@Injectable()
export class UserService extends BaseService {
  public repository: Repository<UserEntity>
  public entity: Entity = UserEntity

  constructor(
    private connection: Connection,
    private hash: HashService,
    private role: RoleService,
    @Inject(forwardRef(() => PasswordResetService))
    private passwordReset: PasswordResetService,
    @Inject(forwardRef(() => UserRoleService))
    private userRole: UserRoleService,
  ) {
    super()
    this.repository = connection.getCustomRepository(UserRepository)
  }

  /**
   * Check identifier
   *
   * @param email string
   * @param username string
   */
  async checkIdentifier(email?: string, username?: string): Promise<void> {
    if (email) {
      await this.checkConflict({ where: { email } })
    }
    if (username) {
      await this.checkConflict({ where: { username } })
    }
  }

  /**
   * Generate verify token
   *
   * @param id number
   */
  async generateVerifyToken(id: number): Promise<boolean> {
    const item = await this.update(id, {
      verifyToken: `${this.hash.md5(id.toString())}${this.hash.md5(
        new Date().toISOString(),
      )}`,
    })
    return item
  }

  /**
   * Verify identifier
   *
   * @param id number
   */
  async verify(id: number): Promise<UserEntity> {
    const item = await this.update(id, {
      verifyToken: '',
      verified: true,
      verifiedAt: new Date(),
    })

    return item
  }

  /**
   * Hash password
   * @param data string
   */
  hashPassword(data: string): string {
    return this.hash.hash(data)
  }

  /**
   * Check password by bcrypt
   *
   * @param password string
   * @param hashed string
   */
  checkPassword(password: string, hashed: string): boolean {
    return this.hash.compare(password, hashed)
  }

  /**
   * Change password of given user_id
   *
   * @param id  number
   * @param password string
   */
  async changePassword(id: number, password: string): Promise<UserEntity> {
    return await this.update(id, { password: this.hash.hash(password) })
  }

  /**
   * Save user and return user entity with relations
   *
   * @param data  CreateUserDto | UserRegisterDto
   * @return User
   */
  async saveUser(data: CreateUserDto | UserRegisterDto): Promise<UserEntity> {
    const { email, username, password } = data

    await this.checkIdentifier(email, username)

    Object.assign(data, { status: data.status ?? DEFAULT_USER_STATUS })

    if (data instanceof UserRegisterDto || data['roleIds'] === undefined) {
      const roleUser: number[] = await this.role.findWhere(
        {
          slug: 'user',
        },
        ['id'],
      )

      data = { ...data, roleIds: roleUser }
    }

    const saveUser: UserEntity = await this.create({
      ...pick(data, [
        'email',
        'username',
        'password',
        'firstName',
        'lastName',
        'status',
      ]),
      ...{
        password: this.hashPassword(password),
        email: this.sanitize(email),
      },
    })

    if (data.roleIds && data.roleIds.length > 0) {
      for (const roleId of data.roleIds) {
        await this.userRole.attachRole({ userId: saveUser.id, roleId })
      }
    }

    return await this.findOneOrFail(saveUser.id, { relations: ['roles'] })
  }

  /**
   * Update user and return user entity with relations
   *
   * @param params.id  number
   * @param params.data  UpdateUserDto
   * @return User
   */
  async updateUser({
    id,
    data,
  }: {
    id: number
    data: UpdateUserDto
  }): Promise<UserEntity> {
    const { email, username, password, roleIds } = data

    await this.checkExisting({ where: { id } })

    await this.checkIdentifier(
      email ? email : undefined,
      username ? username : undefined,
    )

    if (!isNil(password)) {
      Object.assign(data, { password: this.hashPassword(password) })
    }

    if (!isNil(email)) {
      Object.assign(data, { email: this.sanitize(email) })
    }

    const updateUser: UserEntity = await this.update(id, { data })

    if (!isNil(roleIds) && roleIds.length > 0) {
      await this.userRole.updateRelationUserAndRole({
        userId: updateUser.id,
        roleIds,
      })
    }

    return await this.findOneOrFail(updateUser.id, { relations: ['roles'] })
  }

  /**
   * Invite user
   *
   * @param params.data  InviteUserDto
   * @return [UserEntity, PasswordResetEntity]
   */
  async inviteUser(
    data: InviteUserDto,
  ): Promise<[UserEntity, PasswordResetEntity]> {
    await this.checkConflict({ where: { email: data.email } })

    Object.assign(data, {
      username: 'invite-user',
      password: this.hashPassword('password'),
    })

    const user: UserEntity = await this.create(data)

    await this.passwordReset.expireAllToken(user.email)

    const passwordReset = await this.passwordReset.generate(user.email)

    return [user, passwordReset]
  }
}
