import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiHeader, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseService } from 'src/shared/services/api-response/api-response.service';
import { getConnection, getCustomRepository } from 'typeorm';

import { OptionRepository } from '../repositories/option.repository';
import { OptionService } from '../services/option.service';
import { OptionTransformer } from '../transformers/option.transformer';
import slugify from 'slugify';
import { Option } from '../entities/option.entity';
import { CreateOptionDto, UpdateOptionDto } from '../dto/option.dto';

@ApiTags('Options')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('/api/admin/options')
export class AdminOptionController {
  constructor(
    private response: ApiResponseService,
    private optionService: OptionService,
  ) {}

  @Get('list')
  async index(): Promise<any> {
    const option = await this.optionService.get();
    return this.response.collection(option, new OptionTransformer());
  }

  @Get(':key')
  @ApiParam({ name: 'key' })
  async show(@Param() params: any): Promise<any> {
    const option = await getCustomRepository(OptionRepository)
      .createQueryBuilder('options')
      .where('options.key = :key', { key: params.key })
      .getOne();
    if (!option) {
      throw new NotFoundException();
    }
    return this.response.item(option, new OptionTransformer());
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Options created' })
  async create(@Body() data: CreateOptionDto): Promise<any> {
    data['key'] = slugify(data['key'].toLowerCase());
    const option = await this.optionService.create(data);
    return this.response.item(option, new OptionTransformer());
  }

  @Put(':key')
  @ApiParam({ name: 'key' })
  async update(
    @Param() params: any,
    @Body() data: UpdateOptionDto,
  ): Promise<any> {
    data['key'] = slugify(data['key'].toLowerCase());
    await getConnection()
      .createQueryBuilder()
      .update(Option)
      .set(data)
      .where('key = :key', { key: params.key })
      .execute();
    return this.response.success();
  }

  @Delete(':key')
  @ApiParam({ name: 'key' })
  async remove(@Param() params: any): Promise<any> {
    const option = await this.optionService.findWhere(params.key);

    if (!option) {
      throw new NotFoundException();
    }

    await this.optionService.destroy(option.id);

    return this.response.success();
  }
}
