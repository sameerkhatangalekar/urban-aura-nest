import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class UpdateCartItemQuantityDto {
  @IsInt()
  @IsPositive()
  @Min(1)
  quantity: number;

  @IsNotEmpty()
  @IsString()
  id: string;
}
