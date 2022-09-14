import { Entity, Column, OneToMany } from 'typeorm';
import { Notifiable } from '../../../shared/services/notification/decorators/notifiable.decorator';
import { TimeStampEntity } from '../../base.entity';
import { ImageAbleEntity } from './imageAble.entity';

@Notifiable()
@Entity({ name: 'images' })
export class ImageEntity extends TimeStampEntity {
  @Column({ type: 'varchar', default: "''" })
  title: string;

  @Column()
  slug: string;

  @Column({ type: 'varchar', default: "''" })
  url: string;

  @Column({ type: 'int', default: 1 })
  status: number;

  @Column({ type: 'timestamp' })
  public verifiedAt: Date;

  @OneToMany(() => ImageAbleEntity, (imageAbles) => imageAbles.image)
  imageAbles: ImageAbleEntity[];
}
