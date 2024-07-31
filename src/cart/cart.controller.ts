import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { CartService } from './cart.service';
import { GetCurrentUser } from 'src/common/decorators';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CreateCartItemDto, UpdateCartItemQuantityDto } from './dto';
import { CartItemsReturnType, SuccessType } from 'src/common/types';

@Controller('cart')
@ApiTags('Cart')
@ApiBearerAuth()
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getCart(@GetCurrentUser('sub') userId: string): Promise<CartItemsReturnType> {
    return await this.cartService.getCartItems(userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addToCart(
    @Body() createCartItemDto: CreateCartItemDto,
    @GetCurrentUser('sub') userId: string,
  ): Promise<SuccessType> {
    await this.cartService.addToCart(createCartItemDto, userId);
    return {
      message: 'Item added to cart',
    };
  }

  @Put('increment')
  @HttpCode(HttpStatus.ACCEPTED)
  async incrementCartItemQuantity(@Body() updateCartItemQuantityDto: UpdateCartItemQuantityDto): Promise<SuccessType> {
    await this.cartService.incrementCartItemQuantity(updateCartItemQuantityDto);
    return {
      message: 'Item added to cart',
    };
  }

  @Put('decrement')
  @HttpCode(HttpStatus.ACCEPTED)
  async decrementCartItemQuantity(@Body() updateCartItemQuantityDto: UpdateCartItemQuantityDto): Promise<SuccessType> {
    await this.cartService.decrementCartItemQuantity(updateCartItemQuantityDto);
    return {
      message: 'Item removed from cart',
    };
  }

  @Delete(':id')
  async deleteCartItem(@Param('id') cartItemId: string, @GetCurrentUser('sub') userId: string): Promise<SuccessType> {
    await this.cartService.deleteCartItem(cartItemId, userId);
    return {
      message: 'Item removed from cart',
    };
  }
}
