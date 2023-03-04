import { Column, Entity, OneToMany } from 'typeorm'
import { TimeStampEntity } from '../../../shared/entities/base.entity'
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator'
import { ImageAbleEntity } from './imageAble.entity'

@Notifiable()
@Entity({ name: 'image' })
export class ImageEntity extends TimeStampEntity {
  @Column({ type: 'varchar', default: "''" })
  title: string

  @Column({ type: 'varchar' })
  slug: string

  @Column({ type: 'varchar', default: "''" })
  url: string

  @OneToMany(() => ImageAbleEntity, (imageAbles) => imageAbles.image)
  imageAbles: ImageAbleEntity[]
}
