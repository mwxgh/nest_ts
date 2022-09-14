import { EntityRepository, Repository } from 'typeorm';
import { OrderProductEntity } from '../entities/orderProduct.entity';

@EntityRepository(OrderProductEntity)
export class OrderProductRepository extends Repository<OrderProductEntity> {}
