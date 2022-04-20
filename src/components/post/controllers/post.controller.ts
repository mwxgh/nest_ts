import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';
import { getCustomRepository, Connection } from 'typeorm';
import { JoinPostAbleType } from '../entities/post.entity';
import { PostService } from '../services/post.service';
import { PostRepository } from '../repositories/post.repository';
import { IPaginationOptions } from 'src/shared/services/pagination';
import { PostTransformer } from '../transformers/post.transformer';
import { ImageService } from 'src/components/image/services/image.service';
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service';

@ApiTags('Posts')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('/api/posts')
export class UserPostControllers {
  constructor(
    private connection: Connection,
    private postService: PostService,
    private image: ImageService,
    private response: ApiResponseService,
  ) {}
  @Get()
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'include', required: false })
  async index(@Query() query: any): Promise<any> {
    try {
      const params: IPaginationOptions = {
        limit: Number(query.limit) || 10,
        page: Number(query.page) || 1,
      };
      let query_buidler =
        getCustomRepository(PostRepository).createQueryBuilder('posts');
      const keys = Object.keys(JoinPostAbleType);
      const values = Object.values(JoinPostAbleType);
      const key = [];
      const value = [];
      let include = [];
      if (query.include) {
        const arr = query.include.split(',');
        include = [...arr];
        arr.forEach((el) => {
          if (keys.includes(el)) value.push(values[`${keys.indexOf(el)}`]);
          if (keys.includes(el)) key.push(el);
        });
        for (let i = 0; i < key.length; i++) {
          query_buidler = query_buidler.leftJoinAndSelect(
            `${value[`${i}`]}`,
            `${key[`${i}`]}`,
          );
        }
        if (include.includes('categories'))
          query_buidler = query_buidler.leftJoinAndSelect(
            `categories.category`,
            `category`,
          );
      }
      query_buidler.getMany();
      const data = await this.postService.paginate(query_buidler, params);
      return this.response.paginate(data, new PostTransformer());
    } catch (error) {
      return error;
    }
  }

  @Get('type')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'include', required: false })
  @ApiQuery({ name: 'type' })
  async indexType(@Query() query: any): Promise<any> {
    const params: IPaginationOptions = {
      limit: Number(query.limit) || 10,
      page: Number(query.page) || 1,
    };
    const data = await this.postService.JoinTable(query);
    data.where('posts.type = :type', { type: query.type }).getMany();

    const page = await this.postService.paginate(data, params);
    if (!page.items.length) throw new NotFoundException();
    return this.response.paginate(page, new PostTransformer());
  }

  @Get('list')
  @ApiQuery({ name: 'include', required: false })
  async list(@Query() query: any): Promise<any> {
    const data = await this.postService.JoinTable(query);
    const data_list = await data.getMany();
    if (!data_list) throw new NotFoundException();
    return this.response.collection(data_list, new PostTransformer());
  }

  @Get(':id')
  @ApiQuery({ name: 'include', required: false })
  async show(@Param('id') id: string, @Query() query: any): Promise<any> {
    const data = await this.postService.JoinTable(query);
    const data_one = await data
      .where('posts.id = :id', { id: Number(id) })
      .getOne();
    if (!data_one) throw new NotFoundException();
    return this.response.item(data_one, new PostTransformer());
  }
}
