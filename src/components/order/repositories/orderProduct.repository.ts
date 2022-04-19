import { EntityRepository, Repository } from 'typeorm';
import { OrderProduct } from '../entities/orderProduct.entity';

@EntityRepository(OrderProduct)
export class OrderProductRepository extends Repository<OrderProduct> {}
