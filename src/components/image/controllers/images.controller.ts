import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Auth } from 'src/components/auth/decorators/auth.decorator';
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service';
import { CreateImageDto, UpdateImageDto } from '../dto/image.dto';
import { ImageService } from '../services/image.service';
import { ImageTransformer } from '../transformers/image.transformer';
import { FileFastifyInterceptor } from 'fastify-file-interceptor';
import slugify from 'slugify';
import * as _ from 'lodash';
import { QueryManyDto } from 'src/shared/dto/queryParams.dto';
import { IPaginationOptions } from 'src/shared/services/pagination';

@ApiTags('Images')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('/api/images')
export class ImageController {
  constructor(
    private response: ApiResponseService,
    private imageService: ImageService,
  ) {}

  private entity = 'images';

  private fields = ['title'];

  @ApiConsumes('multipart/form-data')
  @Post()
  @Auth('admin')
  @ApiOperation({ summary: 'Admin upload new image' })
  @ApiOkResponse({ description: 'Save image and return image entity' })
  @UseInterceptors(
    FileFastifyInterceptor('file', {
      storage: diskStorage({
        destination:
          process.env.APP_ENV === 'local'
            ? 'public/uploads'
            : 'dist/public/uploads',
        filename: (req, file: Express.Multer.File, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file: Express.Multer.File, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return new Error('Only image files are allowed!');
        }
        cb(null, true);
      },
    }),
  )
  async createImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreateImageDto,
  ) {
    const countImages = await this.imageService.count({
      where: { title: data.title },
    });

    const assignSlug = _.assign(data, {
      slug: slugify(data.title),
    });

    if (countImages) assignSlug.slug = `${assignSlug.slug}-${countImages}`;

    const newFile = _.assign({}, file, {
      key: file.filename,
      location: process.env.APP_URL + '/public/uploads/' + file.filename,
    });

    const assignUrlFile = _.assign(assignSlug, {
      url: newFile.location,
    });

    const image = { ...assignUrlFile };

    await this.imageService.save(image);

    return this.response.success();
  }

  @Get()
  @Auth('admin')
  @ApiOperation({ summary: 'Admin get list image' })
  @ApiOkResponse({ description: 'List images with param query' })
  async readImages(@Query() query: QueryManyDto): Promise<any> {
    const { search, sortBy, sortType } = query;

    const queryBuilder = await this.imageService.queryBuilder({
      entity: this.entity,
      fields: this.fields,
      keyword: search,
      sortBy,
      sortType,
    });

    if (query.perPage || query.page) {
      const paginateOption: IPaginationOptions = {
        limit: query.perPage ? query.perPage : 10,
        page: query.page ? query.page : 1,
      };

      const images = await this.imageService.paginate(
        queryBuilder,
        paginateOption,
      );

      return this.response.paginate(images, new ImageTransformer());
    }

    return this.response.collection(
      await queryBuilder.getMany(),
      new ImageTransformer(),
    );
  }

  @Get(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin get image by id' })
  @ApiOkResponse({ description: 'Image entity' })
  async readImage(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const image = await this.imageService.findOneOrFail(id);

    return this.response.item(image, new ImageTransformer());
  }

  @Put(':id')
  @ApiOperation({ summary: 'Admin update image by id' })
  @ApiOkResponse({ description: 'Update image entity' })
  async updateImage(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateImageDto,
  ): Promise<any> {
    const currentImage = await this.imageService.findOneOrFail(id);

    const countImages = await this.imageService.count({
      where: { title: data.title },
    });

    if (data.title !== currentImage.title) {
      const assignSlug = _.assign(data, { slug: slugify(data.title) });

      if (countImages) assignSlug.slug = `${assignSlug.slug}-${countImages}`;

      const imageUpdate = { ...assignSlug };

      await this.imageService.update(id, imageUpdate);
    } else {
      await this.imageService.update(id, data);
    }
    return this.response.success();
  }

  @Delete(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin delete image by id' })
  @ApiOkResponse({ description: 'Delete image successfully' })
  async deleteImage(@Param('id', ParseIntPipe) id: number): Promise<any> {
    await this.imageService.findOneOrFail(id);

    await this.imageService.destroy(id);

    return this.response.success();
  }
}
