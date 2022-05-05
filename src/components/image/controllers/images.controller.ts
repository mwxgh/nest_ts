import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiConsumes, ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Auth } from 'src/components/auth/decorators/auth.decorator';
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service';
import { getCustomRepository } from 'typeorm';
import { CreateImageDto, UpdateImageDto } from '../dto/image.dto';
import { ImageRepository } from '../repositories/image.reponsitory';
import { ImageService } from '../services/image.service';
import { ImageTransformer } from '../transformers/image.transformer';
import { FileFastifyInterceptor } from 'fastify-file-interceptor';
import { environment } from '../../../../environment';
import slugify from 'slugify';
import * as _ from 'lodash';

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

  @ApiConsumes('multipart/form-data')
  @Post()
  @Auth('admin')
  @UseInterceptors(
    FileFastifyInterceptor('file', {
      storage: diskStorage({
        destination:
          environment.appUrl === 'local'
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
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
    @Body() data: CreateImageDto,
  ) {
    const count = await getCustomRepository(ImageRepository).findAndCount({
      where: { title: data.title },
    });

    const assignSlug = _.assign(data, {
      slug: slugify(data.title),
    });
    if (count) assignSlug.slug = `${assignSlug.slug}-${count}`;

    const new_file = _.assign({}, file, {
      key: file.filename,
      location: environment.appUrl + '/public/uploads/' + file.filename,
    });

    const assignFile = _.assign(assignSlug, {
      value: new_file.location,
    });
    const dataFile = { ...assignFile };
    await getCustomRepository(ImageRepository).save(dataFile);

    return this.response.success();
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  async update(@Param() params, @Body() data: UpdateImageDto): Promise<any> {
    await this.imageService.findOneOrFail(params.id);

    await this.imageService.update(params.id, data);

    return this.response.success();
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<any> {
    await this.imageService.findOneOrFail(id);

    await this.imageService.destroy(id);

    return this.response.success();
  }
}
