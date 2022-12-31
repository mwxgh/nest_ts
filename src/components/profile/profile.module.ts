import { Module } from '@nestjs/common'
import { userProviders } from '../user/user.providers'
import { ProfileController } from './controllers/profile.controller'

@Module({
  controllers: [ProfileController],
  imports: [],
  providers: [...userProviders],
})
export class ProfileModule {}
