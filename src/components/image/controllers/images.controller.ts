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
import Messages from '@shared/message/message'
import { PrimitiveService } from '@shared/services/primitive.service'
import {
  GetItemResponse,
  GetListPaginationResponse,
  GetListResponse,
  SuccessfullyOperation,
} from '@sharedServices/apiResponse/apiResponse.interface'
import { ApiResponseService } from '@sharedServices/apiResponse/apiResponse.service'
import { IPaginationOptions } from '@sharedServices/pagination'
import { FileFastifyInterceptor } from 'fastify-file-interceptor'
import { diskStorage } from 'multer'
import { extname } from 'path'
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
            .join('')
          cb(null, `${randomName}${extname(file.originalname)}`)
        },
      }),
      fileFilter: (req, file: Express.Multer.File, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return new Error('Only image files are allowed!')
        }
        cb(null, true)
      },
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreateImageDto,
  ): Promise<SuccessfullyOperation> {
    await this.imageService.saveImage({ file, data })

    return this.response.success({
      message: this.primitiveService.getMessage({
        message: Messages.successfullyOperation.create,
        keywords: [this.entity],
      }),
    })
  }

  @Get()
  @Auth('admin')
  @ApiOperation({ summary: 'Admin get list image' })
  @ApiOkResponse({ description: 'List images with param query' })
  async readImages(
    @Query() query: QueryManyDto,
  ): Promise<GetListResponse | GetListPaginationResponse> {
    const { search, sortBy, sortType } = query

    const queryBuilder = await this.imageService.queryBuilder({
      entity: this.entity,
      fields: this.fields,
      keyword: search,
      sortBy,
      sortType,
    })

    if (query.perPage || query.page) {
      const paginateOption: IPaginationOptions = {
        limit: query.perPage ? query.perPage : 10,
        page: query.page ? query.page : 1,
      }

      const images = await this.imageService.paginationCalculate(
        queryBuilder,
        paginateOption,
      )

      return this.response.paginate(images, new ImageTransformer())
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
  ): Promise<SuccessfullyOperation> {
    await this.imageService.updateImage({ id, data })

    return this.response.success({
      message: this.primitiveService.getMessage({
        message: Messages.successfullyOperation.update,
        keywords: [this.entity],
      }),
    })
  }

  @Delete(':id')
  @Auth('admin')
  @ApiOperation({ summary: 'Admin delete image by id' })
  @ApiOkResponse({ description: 'Delete image successfully' })
  async deleteImage(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessfullyOperation> {
    await this.imageService.deleteImage({ id })

    return this.response.success({
      message: this.primitiveService.getMessage({
        message: Messages.successfullyOperation.delete,
        keywords: [this.entity],
      }),
    })
  }
}
