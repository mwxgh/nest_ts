import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiHeader, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service';
import { CreateImageDto, UpdateImageDto } from '../dto/image.dto';
import { ImageService } from '../services/image.service';
import { ImageTransformer } from '../transformers/image.transformer';

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

  @Get()
  async index(): Promise<any> {
    const data = await this.imageService.get();

    return this.response.collection(data, new ImageTransformer());
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Images created' })
  async create(@Body() data: CreateImageDto): Promise<any> {
    const image = await this.imageService.create(data);

    return this.response.item(image, new ImageTransformer());
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
  async remove(@Param() params): Promise<any> {
    await this.imageService.findOneOrFail(params.id);

    await this.imageService.destroy(params.id);

    return this.response.success();
  }
}
