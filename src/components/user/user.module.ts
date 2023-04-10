import { AuthModule } from '@authModule/auth.module'
import { Module, forwardRef } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProfileModule } from '@profileModule/profile.module'
import { UserController } from './controllers/user.controller'
import { UserEntity } from './entities/user.entity'
import { UserService } from './services/user.service'
import { userProviders } from './user.providers'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ProfileModule,
    ConfigModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [...userProviders],
  exports: [UserService],
})
export class UserModule {}
