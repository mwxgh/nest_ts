import { AuthModule } from '@authModule/auth.module'
import { Module, forwardRef } from '@nestjs/common'
import { userProviders } from '../user/user.providers'
import { ProfileController } from './controllers/profile.controller'

@Module({
  controllers: [ProfileController],
  imports: [forwardRef(() => AuthModule)],
  providers: [...userProviders],
})
export class ProfileModule {}
