import { Auth } from '@authModule/decorators/auth.decorator'
import { JwtAuthGuard } from '@authModule/guards/jwtAuth.guard'
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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { QueryManyDto } from '@shared/dto/queryParams.dto'
import { IPaginationOptions } from '@shared/interfaces/request.interface'
import {
  GetItemResponse,
  GetListPaginationResponse,
  GetListResponse,
  SuccessfullyOperation,
} from '@shared/interfaces/response.interface'
import Messages from '@shared/message/message'
import { PrimitiveService } from '@shared/services/primitive.service'
import { ApiResponseService } from '@sharedServices/apiResponse/apiResponse.service'

import { ImageEntity } from '@imageModule/entities/image.entity'
import CustomFilesInterceptor from '@shared/uploads/customInterceptor'
import { defaultPaginationOption } from '@shared/utils/defaultPaginationOption.util'
import { SelectQueryBuilder } from 'typeorm'
import { CreateImageDto, UpdateImageDto } from '../dto/image.dto'
import { ImageService } from '../services/image.service'
import { ImageTransformer } from '../transformers/image.transformer'

@ApiTags('Images')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('/api/images')
export class ImageController {
  constructor(
    private response: ApiResponseService,
    private imageService: ImageService,
    private primitiveService: PrimitiveService,
  ) {}

  private entity = 'image'

  private fields = ['title']

  @ApiConsumes('multipart/form-data')
  @Post()
  @Auth('admin')
  @ApiOperation({ summary: 'Admin upload new image' })
  @ApiOkResponse({ description: 'Save image and return image entity' })
  @UseInterceptors(
    CustomFilesInterceptor({
      fieldName: 'file',
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreateImageDto,
  ): Promise<ImageEntity> {
    return this.imageService.saveImage({ file, data })
  }

  @Get()
  @Auth('admin')
  @ApiOperation({ summary: 'Admin get list image' })
  @ApiOkResponse({ description: 'List images with param query' })
  async readImages(
    @Query() query: QueryManyDto,
  ): Promise<GetListResponse | GetListPaginationResponse> {
    const [queryBuilder]: [SelectQueryBuilder<ImageEntity>, string[]] =
      await this.imageService.queryBuilder({
        entity: this.entity,
        fields: this.fields,
        ...query,
      })

    if (query.perPage || query.page) {
      const paginateOption: IPaginationOptions = defaultPaginationOption(query)

      return this.response.paginate(
        await this.imageService.paginationCalculate(
          queryBuilder,
          paginateOption,
        ),
        new ImageTransformer(),
      )
    }

    return this.response.collection(
      await queryBuilder.getMany(),
      new ImageTransformer(),
    )
  }

  @Get(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin get image by id' })
  @ApiOkResponse({ description: 'Image entity' })
  async readImage(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetItemResponse> {
    const image = await this.imageService.findOneOrFail(id)

    return this.response.item(image, new ImageTransformer())
  }

  @Put(':id')
  @ApiOperation({ summary: 'Admin update image by id' })
  @ApiOkResponse({ description: 'Update image entity' })
  async updateImage(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateImageDto,
  ): Promise<ImageEntity> {
    return this.imageService.updateImage({ id, data })
  }

  @Delete(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin delete image by id' })
  @ApiOkResponse({ description: 'Delete image successfully' })
  async deleteImage(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessfullyOperation> {
    await this.imageService.deleteImage(id)

    return this.response.success({
      message: this.primitiveService.getMessage({
        message: Messages.successfullyOperation.delete,
        keywords: [this.entity],
      }),
    })
  }
}
