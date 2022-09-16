import { EntityRepository, Repository } from 'typeorm'
import { ImageAbleEntity } from '../entities/imageAble.entity'

@EntityRepository(ImageAbleEntity)
export class ImageAbleRepository extends Repository<ImageAbleEntity> {}
