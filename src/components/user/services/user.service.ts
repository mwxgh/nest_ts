import { UserRegisterDto } from '@authModule/dto/auth.dto'
import { UserRoleEntity } from '@authModule/entities/userRole.entity'
import { RoleService } from '@authModule/services/role.service'
import { UserRoleService } from '@authModule/services/userRole.service'
import { Injectable } from '@nestjs/common'
import { DEFAULT_USER_STATUS } from '@shared/defaultValue/defaultValue'
import { BaseService } from '@sharedServices/base.service'
import { HashService } from '@sharedServices/hash/hash.service'
import { difference, pick } from 'lodash'
import { Connection, Repository } from 'typeorm'
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto'
import { UserEntity } from '../entities/user.entity'
import { UserRepository } from '../repositories/user.repository'

@Injectable()
export class UserService extends BaseService {
  public repository: Repository<any>
  public entity: any = UserEntity

  constructor(
    private connection: Connection,
    private hashService: HashService,
    private roleService: RoleService,
    private userRoleService: UserRoleService,
  ) {
    super()
    this.repository = connection.getCustomRepository(UserRepository)
  }

  /**
   * Check email exist
   * @param email string
   */
  async emailExist(email: string): Promise<boolean> {
    return (await this.repository.count({ where: { email } })) > 0
  }

  /**
   * Check username exist
   * @param username string
   */
  async usernameExist(username: string): Promise<boolean> {
    return (await this.repository.count({ where: { username } })) > 0
  }

  /**
   * Check identifier
   * @param email string
   * @param username string
   */
  async checkIdentifier(email?: string, username?: string): Promise<void> {
    if (email) {
      await this.emailExist(email)
    }
    if (username) {
      await this.usernameExist(username)
    }
  }

  /**
   * Generate verify token
   * @param id number
   */
  async generateVerifyToken(id: number): Promise<boolean> {
    const item = await this.update(id, {
      verifyToken: `${this.hashService.md5(
        id.toString(),
      )}${this.hashService.md5(new Date().toISOString())}`,
    })
    return item
  }

  /**
   * Verify identifier
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
   * Sanitize data
   * @param data string
   */
  sanitize(data: string): string {
    return data.toLowerCase().trim()
  }

  /**
   * Hash data
   * @param data string
   */
  hash(data: string): string {
    return this.hashService.hash(data)
  }

  /**
   * Check password by bcrypt
   *
   * @param password string
   * @param hashed string
   */
  checkPassword(password: string, hashed: string): boolean {
    return this.hashService.compare(password, hashed)
  }

  /**
   * Change password of given user_id
   *
   * @param id  number
   * @param password string
   */
  async changePassword(id: number, password: string): Promise<UserEntity> {
    return await this.update(id, { password: this.hashService.hash(password) })
  }

  /**
   * Attach user and role
   *
   * @param params.userId userId
   * @param params.roleId roleId
   */
  async attachRole(params: { userId: number; roleId: number }): Promise<void> {
    const { userId, roleId } = params
    const role = await this.roleService.findOneOrFail(roleId)

    const user = await this.repository.findOneOrFail(userId)

    if (role && user) {
      await this.userRoleService.firstOrCreate(
        {
          where: {
            userId: user.id,
            roleId: role.id,
          },
        },
        { userId: user.id, roleId: role.id },
      )
    }
  }

  /**
   * Detach user and role
   *
   * @param params.userId userId
   * @param params.roleId roleId
   */
  async detachRole(params: { userId: number; roleId: number }): Promise<void> {
    const { userId, roleId } = params
    const role = await this.roleService.findOneOrFail(roleId)

    const user = await this.repository.findOneOrFail(userId)

    if (role && user) {
      const userRole: UserRoleEntity = await this.userRoleService.firstOrFail({
        where: {
          userId: user.id,
          roleId: role.id,
        },
      })

      if (userRole) {
        await this.userRoleService.destroy(userRole.id)
      }
    }
  }

  /**
   * Save user and return user entity with relations
   *
   * @param params.data  CreateUserDto | UserRegisterDto
   * @return User
   */
  async saveUser(params: {
    data: CreateUserDto | UserRegisterDto
  }): Promise<UserEntity> {
    let { data } = params
    const { email, username, password } = data

    this.checkIdentifier(email, username)

    const userStatus = data.status ?? DEFAULT_USER_STATUS

    if (data instanceof UserRegisterDto || data['roleIds'] === undefined) {
      const roleUser: number[] = await this.roleService.findWhere(
        {
          slug: 'user',
        },
        ['id'],
      )

      data = { ...data, roleIds: roleUser }
    }

    data.status = userStatus

    const saveUser = await this.create({
      ...pick(data, [
        'email',
        'username',
        'password',
        'firstName',
        'lastName',
        'status',
      ]),
      ...{
        password: this.hash(password),
        email: this.sanitize(email),
      },
    })

    if (data.roleIds && data.roleIds.length > 0) {
      for (const roleId of data.roleIds) {
        await this.attachRole({ userId: saveUser.id, roleId })
      }
    }

    return await this.findOneOrFail(saveUser.id, { relations: ['roles'] })
  }

  /**
   * Update user and return user entity with relations
   *
   * @param params.data  UpdateUserDto
   * @return User
   */
  async updateUser(params: {
    id: number
    data: UpdateUserDto
  }): Promise<UserEntity> {
    const { id, data } = params
    const { email, username, password, roleIds } = data

    const existingUser = await this.findOneOrFail(id)

    this.checkIdentifier(
      email ? email : undefined,
      username ? username : undefined,
    )

    const updateUser = await this.update(existingUser.id, {
      ...pick(data, [
        'email',
        'username',
        'password',
        'firstName',
        'lastName',
        'status',
      ]),
      ...{
        password: this.hash(password),
        email: this.sanitize(email),
      },
    })

    if (data.roleIds.length > 0) {
      await this.updateRelationUserAndRole({
        userId: updateUser.id,
        roleIds,
      })
    }

    return await this.findOneOrFail(updateUser.id, { relations: ['roles'] })
  }

  /**
   * Update relation role when update user ...
   * @param params.userId
   * @param params.roleIds
   */
  async updateRelationUserAndRole(params: {
    userId: number
    roleIds: number[]
  }): Promise<void> {
    const { userId, roleIds } = params

    const currentRoleIds: number[] = await this.userRoleService.findWhere(
      {
        userId,
      },
      ['roleId'],
    )

    if (currentRoleIds.length === 0) {
      return
    }

    // detach role
    const detachRoleIds: number[] = difference(currentRoleIds, roleIds)

    for (const detachRoleId of detachRoleIds) {
      await this.detachRole({ userId, roleId: detachRoleId })
    }

    // attach new role
    const newAttachRoleIds: number[] = difference(roleIds, currentRoleIds)

    const existingRoles = await this.roleService.findIdInOrFail(
      newAttachRoleIds,
    )

    if (existingRoles && existingRoles.length > 0) {
      const roleIds = existingRoles.map((role) => role.id)

      for (const roleId of roleIds) {
        await this.attachRole({ userId, roleId })
      }
    }
  }
}
