import { Size } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateCartItemDto {
  @IsInt()
  @IsPositive()
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  @IsString()
  color: string;

  @IsNotEmpty()
  @IsEnum(Size)
  size: Size;

  @IsNotEmpty()
  @IsString()
  productId: string;
}
