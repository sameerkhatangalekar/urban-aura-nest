import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    readonly name :  string;

    @IsEmail()
    @IsNotEmpty()
    readonly email : string;
    @IsString()
    @IsNotEmpty()
    @Length(4,8)
    readonly password : string;

    

}