import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { CartService } from './cart.service';
import { GetCurrentUser } from 'src/common/decorators';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateCartItemDto, UpdateCartItemQuantityDto } from './dto';

@Controller('cart')
@ApiTags('Cart')
@ApiBearerAuth()
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getCart(@GetCurrentUser('sub') userId: string) {
    return this.cartService.getCartItems(userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  addToCart(@Body() createCartItemDto: CreateCartItemDto, @GetCurrentUser('sub') userId: string) {
    return this.cartService.addToCart(createCartItemDto, userId);
  }

  @Put('increment')
  @HttpCode(HttpStatus.ACCEPTED)
  incrementCartItemQuantity(@Body() updateCartItemQuantityDto: UpdateCartItemQuantityDto) {
    return this.cartService.incrementCartItemQuantity(updateCartItemQuantityDto);
  }

  @Put('decrement')
  @HttpCode(HttpStatus.ACCEPTED)
  decrementCartItemQuantity(@Body() updateCartItemQuantityDto: UpdateCartItemQuantityDto) {
    return this.cartService.decrementCartItemQuantity(updateCartItemQuantityDto);
  }

  @Delete(':id')
  deleteCartItem(@Param('id') cartItemId: string, @GetCurrentUser('sub') userId: string) {
    return this.cartService.deleteCartItem(cartItemId, userId);
  }
}
