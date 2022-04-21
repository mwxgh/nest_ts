import { EntityRepository, Repository } from 'typeorm';
import { UserRole } from '../entities/userRole.entity';

@EntityRepository(UserRole)
export class UserRoleRepository extends Repository<UserRole> {}
