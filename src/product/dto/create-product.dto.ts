import { Size } from '@prisma/client';
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly brand: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsNumber()
  @IsPositive()
  @Min(1)
  readonly price: number;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  readonly colors: string[];
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  readonly sizes: Size[];

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  readonly images: [];
}
