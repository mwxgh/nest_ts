import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { BaseService } from '../../../shared/services/base.service';
import { UserRepository } from '../repositories/user.repository';
import { Repository, Connection } from 'typeorm';
import { HashService } from '../../../shared/services/hash/hash.service';
import { RoleService } from 'src/components/auth/services/role.service';
import { UserRoleService } from 'src/components/auth/services/userRole.service';

@Injectable()
export class UserService extends BaseService {
  public repository: Repository<any>;
  public entity: any = User;

  constructor(
    private dataSource: Connection,
    private hashService: HashService,
    private roleService: RoleService,
    private userRoleService: UserRoleService,
  ) {
    super();
    this.repository = dataSource.getCustomRepository(UserRepository);
  }

  async emailExist(email: string): Promise<boolean> {
    return (await this.repository.count({ where: { email } })) > 0;
  }

  async usernameExist(username: string): Promise<boolean> {
    return (await this.repository.count({ where: { username } })) > 0;
  }

  async generateVerifyToken(id: number): Promise<boolean> {
    const item = await this.update(id, {
      verifyToken: `${this.hashService.md5(
        id.toString(),
      )}${this.hashService.md5(new Date().toISOString())}`,
    });
    return item;
  }

  async verify(id: number): Promise<User> {
    const item = await this.update(id, {
      verifyToken: '',
      verified: true,
      verifiedAt: new Date(),
    });
    return item;
  }

  sanitizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  hashPassword(password: string): string {
    return this.hashService.hash(password);
  }

  checkPassword(password: string, hashed: string): boolean {
    return this.hashService.check(password, hashed);
  }

  /**
   * Change password of given user_id
   *
   * @param id  number | string
   * @param password string
   */
  async changePassword(id: number | string, password: string): Promise<User> {
    return await this.update(id, { password: this.hashService.hash(password) });
  }

  async attachRole(
    userId: number | string,
    roleId: number | string,
  ): Promise<any> {
    const role = await this.roleService.findOneOrFail(roleId);

    const user = await this.repository.findOneOrFail(userId);

    if (role && user) {
      await this.userRoleService.firstOrCreate(
        {
          where: {
            userId: user.id,
            roleId: role.id,
          },
        },
        { userId: user.id, roleId: role.id },
      );
    }
  }

  async detachRole(
    userId: number | string,
    roleId: number | string,
  ): Promise<any> {
    const role = await this.roleService.findOneOrFail(roleId);

    const user = await this.repository.findOneOrFail(userId);

    if (role && user) {
      const userRole = await this.userRoleService.firstOrFail({
        where: {
          userId: user.id,
          roleId: role.id,
        },
      });
      if (userRole) {
        await this.userRoleService.destroy(userRole.id);
      }
    }
  }
}
