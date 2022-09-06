import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { includes, map } from 'lodash';
import { User } from 'src/components/user/entities/user.entity';

export class CommonService {
  /**
   * Check user permission operation with userId
   *
   * @param currentUser User
   * @param userId User
   *
   * @return void
   */
  checkUserPermissionOperation(params: {
    currentUser: User;
    userId: number;
  }): void {
    const { currentUser, userId } = params;

    const userRoles = map(currentUser.roles, (r) => r.slug);

    if (includes(userRoles, 'user') && userRoles.length == 1) {
      if (currentUser.id !== userId) {
        throw new ForbiddenException(
          'Permission denied : User role can not operation',
        );
      }
    }
  }

  /**
   * Check includes param and convert to join and select table
   *
   * @param includes include param
   * @param entity entity
   *
   * @return join and select table
   */
  includesParamToJoinAndSelects(params: {
    includesParams: string[];
    joinTables: string[];
  }): string[] {
    const { includesParams, joinTables } = params;

    const joinAndSelects = includesParams.filter((item) =>
      joinTables.includes(item),
    );

    if (joinAndSelects.length === 0) {
      throw new BadRequestException('Can not join table with includes params');
    }

    return joinAndSelects;
  }

  /**
   * Get message to notice status operation
   *
   * @param message message form
   * @param keywords keyword for each properties
   *
   * @return string
   */
  getMessage(params: { message: string; keywords: string[] }): string {
    let { message } = params;

    params.keywords.forEach((keyword) => {
      message = message.replace('${keyword}', keyword);
    });

    return message;
  }
}
