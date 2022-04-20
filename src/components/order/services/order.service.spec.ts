import { Test, TestingModule } from '@nestjs/testing';
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service';
import { Repository } from 'typeorm';
import { OrderController } from '../controllers/order.controller';
import { OrderService } from './order.service';

describe('ProductService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        OrderService,
        ApiResponseService,
        {
          provide: 'OrderRepository',
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
