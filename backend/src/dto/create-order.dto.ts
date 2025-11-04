import { IsArray, IsBoolean, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CreateOrderItemDto {
  @IsNotEmpty()
  @IsString()
  productId!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  size?: string;
}

class AddressDto {
  @IsOptional() @IsString() country?: string;
  @IsOptional() @IsString() firstName?: string;
  @IsNotEmpty() @IsString() lastName!: string;
  @IsNotEmpty() @IsString() address!: string;
  @IsOptional() @IsString() apartment?: string;
  @IsOptional() @IsString() postalCode?: string;
  @IsNotEmpty() @IsString() city!: string;
  @IsNotEmpty() @IsString() phone!: string;
}

export class CreateOrderDto {
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsBoolean() emailOptIn?: boolean;

  @ValidateNested() @Type(() => AddressDto)
  shipping!: AddressDto;

  @IsOptional() @IsBoolean() billingSameAsShipping?: boolean;
  @IsOptional() @ValidateNested() @Type(() => AddressDto)
  billing?: AddressDto;

  @IsOptional() @IsString() shippingMethod?: string;
  @IsOptional() @IsIn(['COD']) paymentMethod?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];

  @IsNumber() @Min(0) subtotal!: number;
  @IsNumber() @Min(0) shippingCost!: number;
  @IsNumber() @Min(0) total!: number;

  @IsOptional() @IsString() notes?: string;
}


