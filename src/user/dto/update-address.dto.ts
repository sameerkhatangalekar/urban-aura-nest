import { IsNotEmpty, IsNumberString, IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdateAddressDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  city?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  state?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  country?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  line_one?: string;

  @IsOptional()
  @IsNumberString()
  postal_code?: string;
}
