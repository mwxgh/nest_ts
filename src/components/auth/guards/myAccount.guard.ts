import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtAuthGuard } from './jwtAuth.guard'

@Injectable()
export class MyAccountGuard extends JwtAuthGuard {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context)
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException()
    }

    console.log(info)

    return user
  }
}
