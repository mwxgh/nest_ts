import { CommonService } from 'src/shared/services/common.service';
import { CategoryAbleService } from '../category/services/categoryAble.service';
import { ImageService } from '../image/services/image.service';
import { ProductService } from './services/product.service';

export const productProviders = [
  ProductService,
  ImageService,
  CategoryAbleService,
  CommonService,
];
