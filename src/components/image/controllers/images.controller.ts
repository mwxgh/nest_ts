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
import { ApiResponseService } from '@sharedServices/apiResponse/apiResponse.service'

import { ImageEntity } from '@imageModule/entities/image.entity'
import CustomFilesInterceptor from '@shared/uploads/customInterceptor'
import { defaultPaginationOption } from '@shared/utils/defaultPaginationOption.util'
import { APIDoc } from 'src/components/components.apidoc'
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
    private image: ImageService,
  ) {}

  private entity = 'image'
  private fields = ['title']

  @ApiConsumes('multipart/form-data')
  @Post()
  @Auth('admin')
  @ApiOperation({ summary: APIDoc.image.create.apiOperation })
  @ApiOkResponse({ description: APIDoc.image.create.apiOk })
  @UseInterceptors(
    CustomFilesInterceptor({
      fieldName: 'file',
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreateImageDto,
  ): Promise<ImageEntity> {
    return this.image.saveImage({ file, data })
  }

  @Get()
  @Auth('admin')
  @ApiOperation({ summary: APIDoc.image.read.apiOperation })
  @ApiOkResponse({ description: APIDoc.image.read.apiOk })
  async readImages(
    @Query() query: QueryManyDto,
  ): Promise<GetListResponse | GetListPaginationResponse> {
    const [queryBuilder]: [SelectQueryBuilder<ImageEntity>, string[]] =
      await this.image.queryBuilder({
        entity: this.entity,
        fields: this.fields,
        ...query,
      })

    if (query.perPage || query.page) {
      const paginateOption: IPaginationOptions = defaultPaginationOption(query)

      return this.response.paginate(
        await this.image.paginationCalculate(queryBuilder, paginateOption),
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
  @ApiOperation({ summary: APIDoc.image.detail.apiOperation })
  @ApiOkResponse({ description: APIDoc.image.detail.apiOk })
  async readImage(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetItemResponse> {
    const image = await this.image.findOneOrFail(id)

    return this.response.item(image, new ImageTransformer())
  }

  @Put(':id')
  @ApiOperation({ summary: APIDoc.image.update.apiOperation })
  @ApiOkResponse({ description: APIDoc.image.update.apiOk })
  async updateImage(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateImageDto,
  ): Promise<ImageEntity> {
    return this.image.updateImage({ id, data })
  }

  @Delete(':id')
  @Auth('admin')
  @ApiOperation({ summary: APIDoc.image.delete.apiOperation })
  @ApiOkResponse({ description: APIDoc.image.delete.apiOk })
  async deleteImage(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessfullyOperation> {
    await this.image.deleteImage(id)

    return this.response.success({
      message: this.image.getMessage({
        message: Messages.successfullyOperation.delete,
        keywords: [this.entity],
      }),
    })
  }
}
