import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { IsInt, IsNumber, Min } from 'class-validator';

export class CartItemProperties {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsInt()
  productId: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsInt()
  cartId: number;

  @ApiProperty()
  @IsNumber()
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateCartItemDto extends PickType(CartItemProperties, [
  'productId',
  'cartId',
  'quantity',
] as const) {}

export class UpdateCartItemDto extends PartialType(CartItemProperties) {}
