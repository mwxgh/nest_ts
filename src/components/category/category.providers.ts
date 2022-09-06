import { CategoryAbleService } from './services/categoryAble.service';
import { CategoryService } from './services/category.service';
import { CommonService } from 'src/shared/services/common.service';

export const categoryProviders = [
  CategoryService,
  CategoryAbleService,
  CommonService,
];
