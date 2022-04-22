import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service';
import { getConnection, getCustomRepository } from 'typeorm';

import { OptionRepository } from '../repositories/option.repository';
import { OptionService } from '../services/option.service';
import { OptionTransformer } from '../transformers/option.transformer';
import slugify from 'slugify';
import { Option } from '../entities/option.entity';
import { CreateOptionDto, UpdateOptionDto } from '../dto/option.dto';
import { JwtAuthGuard } from 'src/components/auth/guards/jwtAuth.guard';
import { Auth } from 'src/components/auth/decorators/auth.decorator';
import {
  QueryListDto,
  QueryPaginateDto,
} from 'src/shared/dto/findManyParams.dto';
import { IPaginationOptions } from 'src/shared/services/pagination';

@ApiTags('Options')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Auth('admin')
@Controller('/api/options')
export class OptionController {
  constructor(
    private response: ApiResponseService,
    private optionService: OptionService,
  ) {}

  private entity = 'options';

  private fields = ['key'];

  @Get('listPaginate')
  @ApiOperation({
    summary: 'Admin list options with query & paginate',
  })
  @ApiOkResponse({
    description: 'List options with search & includes & filter in paginate',
  })
  async listPaginate(@Query() query: QueryPaginateDto): Promise<any> {
    const params: IPaginationOptions = {
      limit: Number(query.perPage) || 10,
      page: Number(query.page) || 1,
    };

    const baseQuery = await this.optionService.queryBuilder(
      this.entity,
      this.fields,
      query.search,
    );

    const option = await this.optionService.paginate(baseQuery, params);

    return this.response.paginate(option, new OptionTransformer());
  }

  @Get('listQuery')
  @ApiOperation({ summary: 'List options with query / without paginate' })
  @ApiOkResponse({
    description: 'List options with search & includes & filter',
  })
  async listQuery(@Query() query: QueryListDto): Promise<any> {
    const baseQuery = await this.optionService.queryBuilder(
      this.entity,
      this.fields,
      query.search,
    );
    return this.response.collection(await baseQuery, new OptionTransformer());
  }

  @Get(':key')
  @ApiOperation({ summary: 'Get option by key' })
  @ApiOkResponse({ description: 'Option entity' })
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
  @ApiOperation({ summary: 'Admin create new option' })
  @ApiOkResponse({ description: 'New option entity' })
  async create(@Body() data: CreateOptionDto): Promise<any> {
    data['key'] = slugify(data['key'].toLowerCase());

    const option = await this.optionService.create(data);

    return this.response.item(option, new OptionTransformer());
  }

  @Put(':key')
  @ApiOperation({ summary: 'Admin update option by key' })
  @ApiOkResponse({ description: 'Update option entity' })
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
  @ApiOperation({ summary: 'Admin delete option by key' })
  @ApiOkResponse({ description: 'Delete option successfully' })
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
