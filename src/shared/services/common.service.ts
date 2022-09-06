import { ForbiddenException } from '@nestjs/common';
import { includes, map } from 'lodash';
import { User } from 'src/components/user/entities/user.entity';
import { Entity } from '../interfaces/interface';

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
   * Check includes param to transform data
   *
   * @param includes include param
   * @param entity entity
   *
   * @return transformer
   */
  // checkIncludeToTransformer(params: {
  //   includes: string[];
  //   entity: Entity;
  // }): void {
  //   const { includes, entity } = params;
  // }

  /**
   * Get message to notice operation
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
