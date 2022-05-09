import { EntityRepository, Repository } from 'typeorm';
import { ImageAble } from '../entities/imageAble.entity';

@EntityRepository(ImageAble)
export class ImageAbleRepository extends Repository<ImageAble> {}
