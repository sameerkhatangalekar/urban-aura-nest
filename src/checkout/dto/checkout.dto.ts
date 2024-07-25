import { IsEmail, IsNotEmpty, IsNumber, IsNumberString, IsPhoneNumber, IsPositive, IsString } from 'class-validator';

export class CheckoutDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsPhoneNumber('IN')
  contact: string;

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
