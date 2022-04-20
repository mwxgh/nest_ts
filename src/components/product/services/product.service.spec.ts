import { Test, TestingModule } from '@nestjs/testing';
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service';
import { Repository } from 'typeorm';
import { ProductController } from '../controllers/product.controller';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        ProductService,
        ApiResponseService,
        {
          provide: 'ProductRepository',
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
