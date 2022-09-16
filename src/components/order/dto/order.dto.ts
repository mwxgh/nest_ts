import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator'

export class OrderProperties {
  @ApiProperty({
    type: String,
    default: 'Nguyễn Văn A',
  })
  @IsNotEmpty()
  fullName: string

  @ApiProperty({
    type: String,
    default: 'example@mwx.com',
  })
  @IsOptional()
  @IsEmail()
  email: string

  @ApiProperty({
    type: String,
    default: '+84356377331',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string

  @ApiProperty({
    type: String,
    default: 'Hà Nội',
  })
  @IsNotEmpty()
  address: string

  @ApiProperty()
  @IsOptional()
  note: string

  @ApiProperty({
    type: Number,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  status: number
}

// contact -> system user order
// fullName, email, phone,... -> portal user order
// => union type for createOrderDto
export class CreateOrderDto extends OmitType(OrderProperties, [] as const) {}

export class UpdateOrderDto extends PartialType(OrderProperties) {}

export class OrderProductProperties {
  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  @IsInt()
  orderId: number

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
    },
    default: [
      {
        product_id: 1,
        quantity: 1,
      },
    ],
  })
  products: [ProductItems]
}

export class ProductItems {
  @ApiProperty({ type: Number })
  @IsInt()
  productId: number

  @ApiProperty({ type: Number })
  @IsInt()
  quantity: number
}

export class CreateOrderProductDto extends OmitType(
  OrderProductProperties,
  [] as const,
) {}

export class UpdateOrderProductDto extends PartialType(
  OrderProductProperties,
) {}
