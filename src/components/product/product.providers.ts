import { CommonService } from 'src/shared/services/common.service';
import { CategoryService } from '../category/services/category.service';
import { CategoryAbleService } from '../category/services/categoryAble.service';
import { ImageService } from '../image/services/image.service';
import { TagService } from '../tag/services/tag.service';
import { TagAbleService } from '../tag/services/tagAble.service';
import { ProductService } from './services/product.service';

export const productProviders = [
  ProductService,
  ImageService,
  CategoryAbleService,
  CommonService,
  TagAbleService,
  TagService,
  CategoryService,
];
