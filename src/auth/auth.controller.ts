import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, CreateUserDto } from './dto';
import { GetCurrentUser, Public } from 'src/common/decorators';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: CreateUserDto) {
    return this.authService.signup(dto);
  }

  @Get('test')
  @HttpCode(HttpStatus.OK)
  testAPi(@GetCurrentUser() userId: string) {
    return userId;
  }
}
