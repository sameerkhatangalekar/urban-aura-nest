import { IsNotEmpty, IsNumberString, IsPhoneNumber, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsPhoneNumber('IN')
  contact: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  line_one: string;

  @IsNumberString()
  postal_code: string;
}
