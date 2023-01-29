import { PasswordResetEntity } from '../src/components/auth/entities/passwordReset.entity'
import { PermissionEntity } from '../src/components/auth/entities/permission.entity'
import { RoleEntity } from '../src/components/auth/entities/role.entity'
import { RolePermissionEntity } from '../src/components/auth/entities/rolePermission.entity'
import { UserRoleEntity } from '../src/components/auth/entities/userRole.entity'
import { CartEntity } from '../src/components/cart/entities/cart.entity'
import { CartItemEntity } from '../src/components/cart/entities/cartItem.entity'
import { CategoryEntity } from '../src/components/category/entities/category.entity'
import { CategoryAbleEntity } from '../src/components/category/entities/categoryAble.entity'
import { CommentEntity } from '../src/components/comment/entities/comment.entity'
import { ContactEntity } from '../src/components/contact/entities/contact.entity'
import { ImageEntity } from '../src/components/image/entities/image.entity'
import { ImageAbleEntity } from '../src/components/image/entities/imageAble.entity'
import { OrderEntity } from '../src/components/order/entities/order.entity'
import { OrderProductEntity } from '../src/components/order/entities/orderProduct.entity'
import { PostEntity } from '../src/components/post/entities/post.entity'
import { ProductEntity } from '../src/components/product/entities/product.entity'
import { TagEntity } from '../src/components/tag/entities/tag.entity'
import { TagAbleEntity } from '../src/components/tag/entities/tagAble.entity'
import { UserEntity } from '../src/components/user/entities/user.entity'

export default (): any => ({
  type: process.env.DB_CONNECTION || 'mysql',
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),
  entities: [
    UserEntity,
    RoleEntity,
    PermissionEntity,
    PasswordResetEntity,
    RolePermissionEntity,
    UserRoleEntity,
    ProductEntity,
    CartEntity,
    CartItemEntity,
    CategoryEntity,
    CategoryAbleEntity,
    OrderEntity,
    OrderProductEntity,
    TagAbleEntity,
    CommentEntity,
    ImageEntity,
    ImageAbleEntity,
    PostEntity,
    TagEntity,
    ContactEntity,
  ],
  // autoLoadEntities: true,

  // We are using migrations, synchronize should be set to false.
  synchronize: false,

  // Run migrations automatically,
  // you can disable this if you prefer running migration manually.
  migrationsRun: true,
  logging: process.env.DB_LOGGING === 'true',
  logger: 'file',

  // Allow both start:prod and start:dev to use migrations
  // __dirname is either dist or src folder, meaning either
  // the compiled js in prod or the ts in dev.
  migrations: [__dirname + '/database/migrations/**/*{.ts,.js}'],
  cli: {
    // Location of migration should be inside src folder
    // to be compiled into dist/ folder.
    migrationsDir: 'database/migrations',
  },
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
})
