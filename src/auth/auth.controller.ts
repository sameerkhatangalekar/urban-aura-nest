import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, CreateGoogleUserDto, CreateUserDto } from './dto';
import { GetCurrentUser, Public, Roles } from 'src/common/decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUserDto } from 'src/common/dto';
import { SuccessType } from 'src/common/types';
import { Token } from './types';

@Controller('auth')
@ApiTags('Authentication')
@ApiBearerAuth()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() dto: AuthDto): Promise<Token> {
    return await this.authService.signin(dto);
  }

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: CreateUserDto): Promise<Token> {
    return await this.authService.signup(dto);
  }

  @Public()
  @Post('/google/signin')
  @HttpCode(HttpStatus.CREATED)
  async signinWithGoogle(@Body() dto: CreateGoogleUserDto): Promise<SuccessType> {
    await this.authService.signinWithGoogle(dto);
    return {
      message: 'Signed up succesfully',
    };
  }

  @Get('test')
  @HttpCode(HttpStatus.OK)
  @Roles(['ADMIN'])
  testAPi(@GetCurrentUser() user: CurrentUserDto) {
    return user;
  }
}
