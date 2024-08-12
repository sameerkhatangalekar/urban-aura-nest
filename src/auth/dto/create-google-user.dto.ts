import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateGoogleUserDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;
  @IsString()
  @IsNotEmpty()
  readonly uid: string;
}
