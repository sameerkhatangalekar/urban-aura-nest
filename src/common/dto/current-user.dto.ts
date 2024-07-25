import { Role } from '@prisma/client';
import { IsArray, IsEmail, isEnum, IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CurrentUserDto {
  @IsString()
  @IsNotEmpty()
  sub: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsEnum(Role, {
    each: true,
  })
  roles: Role[];

  @IsNumber()
  @IsPositive()
  iat: number;

  @IsNumber()
  @IsPositive()
  exp: number;
}
