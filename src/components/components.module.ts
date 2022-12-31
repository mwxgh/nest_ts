import { AuthModule } from '@authModule/auth.module'
import { CartModule } from '@cartModule/cart.module'
import { CategoryModule } from '@categoryModule/category.module'
import { CommentModule } from '@commentModule/comment.module'
import { ContactModule } from '@contactModule/contact.module'
import { ImageModule } from '@imageModule/image.module'
import { Module } from '@nestjs/common'
import { OrderModule } from '@orderModule/order.module'
import { PostModule } from '@postModule/post.module'
import { ProductModule } from '@productModule/product.module'
import { ProfileModule } from '@profileModule/profile.module'
import { TagModule } from '@tagModule/tag.module'
import { UserModule } from '@userModule/user.module'

@Module({
  imports: [
    AuthModule,
    CartModule,
    CategoryModule,
    CommentModule,
    ContactModule,
    ImageModule,
    OrderModule,
    PostModule,
    ProductModule,
    ProfileModule,
    TagModule,
    UserModule,
  ],
})
export class ComponentsModule {}
