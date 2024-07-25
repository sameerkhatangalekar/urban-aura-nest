import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/common/decorators';
import { CurrentUserDto } from 'src/common/dto';
import { CheckoutService } from './checkout.service';
import { CheckoutDto } from './dto';

@ApiBearerAuth()
@ApiTags('Checkout')
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  async checkout(@GetCurrentUser() user: CurrentUserDto, @Body() checkoutDto: CheckoutDto) {
    const clientSecret = await this.checkoutService.checkout(checkoutDto, user);

    return {
      clientSecret,
    };
  }
}
