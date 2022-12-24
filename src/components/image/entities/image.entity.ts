import { Entity, Column, OneToMany } from 'typeorm'
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator'
import { TimeStampEntity } from '../../base.entity'
import { ImageAbleEntity } from './imageAble.entity'

export enum ImageStatus {
  publish = 'PUBLISH',
  hide = 'HIDE',
}

@Notifiable()
@Entity({ name: 'image' })
export class ImageEntity extends TimeStampEntity {
  @Column({ type: 'varchar', default: "''" })
  title: string

  @Column({ type: 'varchar' })
  slug: string

  @Column({ type: 'varchar', default: "''" })
  url: string

  @Column({ type: 'enum', enum: ImageStatus })
  status: ImageStatus

  @Column({ type: 'timestamp' })
  public verifiedAt: Date

  @OneToMany(() => ImageAbleEntity, (imageAbles) => imageAbles.image)
  imageAbles: ImageAbleEntity[]
}
