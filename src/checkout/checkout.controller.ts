import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/common/decorators';
import { CurrentUserDto } from 'src/common/dto';
import { CheckoutService } from './checkout.service';
import { CheckoutDto } from './dto';
import { StripTransactionKeys } from 'src/common/types';

@ApiBearerAuth()
@ApiTags('Checkout')
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  async checkout(
    @GetCurrentUser() user: CurrentUserDto,
    @Body() checkoutDto: CheckoutDto,
  ): Promise<StripTransactionKeys> {
    const keys = await this.checkoutService.checkout(checkoutDto, user);

    return keys;
  }
}
