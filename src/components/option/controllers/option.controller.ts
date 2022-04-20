import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiHeader, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiResponseService } from 'src/shared/services/apiResponse/apiResponse.service';
import { getCustomRepository } from 'typeorm';
import { OptionRepository } from '../repositories/option.repository';
import { OptionService } from '../services/option.service';
import { OptionTransformer } from '../transformers/option.transformer';

@ApiTags('Options')
@ApiHeader({
  name: 'Content-Type',
  description: 'application/json',
})
@Controller('/api/options')
export class UserOptionController {
  constructor(
    private response: ApiResponseService,
    private optionService: OptionService,
  ) {}

  @Get('list')
  async index(): Promise<any> {
    const option = await this.optionService.findAllOrFail();

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
}
