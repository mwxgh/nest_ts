import { get } from 'lodash';
import { Observable } from 'rxjs';

import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WsAuthGuard {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { token } = context.getArgByIndex(1);
    if (token) {
      const data = this.jwtService.decode(token);
      if (data) {
        request.wsUserId = get(data, 'id');
        return true;
      } else {
        return false;
      }
    }
    return false;
  }
}
