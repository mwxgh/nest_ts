import { Test, TestingModule } from '@nestjs/testing';
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service';
import { Repository } from 'typeorm';
import { CategoryController } from '../controllers/category.controller';
import { CategoryService } from './category.service';

describe('ProductService', () => {
  let service: CategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        CategoryService,
        ApiResponseService,
        {
          provide: 'CategoryRepository',
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
