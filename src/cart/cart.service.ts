import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCartItemDto, UpdateCartItemQuantityDto } from './dto';

import { CartItem } from '@prisma/client';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  async getCartItems(userId: string): Promise<{ cart: CartItem[]; cartTotal: number }> {
    const cart = await this.prisma.cartItem.findMany({
      where: {
        userId: userId,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            brand: true,
            description: true,
            price: true,
            images: true,
            discount: true,
            rating: true,
          },
        },
      },
    });

    const cartTotal = cart.reduce((prev, curr) => {
      return prev + curr.quantity * curr.product.price;
    }, 0);

    return { cart, cartTotal };
  }

  async addToCart(createCartItemDto: CreateCartItemDto, userId: string): Promise<CartItem> {
    const cartItem = await this.prisma.cartItem.create({
      data: {
        color: createCartItemDto.color,
        quantity: createCartItemDto.quantity,
        size: createCartItemDto.size,
        productId: createCartItemDto.productId,
        userId: userId,
      },
    });

    return cartItem;
  }

  async incrementCartItemQuantity(updateCartItemQuantityDto: UpdateCartItemQuantityDto): Promise<string> {
    const cartItem = await this.prisma.cartItem.update({
      data: {
        quantity: {
          increment: updateCartItemQuantityDto.quantity,
        },
      },
      where: {
        id: updateCartItemQuantityDto.id,
      },
    });

    return 'Item updated';
  }

  async decrementCartItemQuantity(updateCartItemQuantityDto: UpdateCartItemQuantityDto): Promise<string> {
    const cartItem = await this.prisma.cartItem.findUnique({
      where: {
        id: updateCartItemQuantityDto.id,
      },
    });

    const shouldDeleteItem = cartItem.quantity - updateCartItemQuantityDto.quantity > 0 ? false : true;

    if (shouldDeleteItem) {
      await this.prisma.cartItem.delete({
        where: {
          id: updateCartItemQuantityDto.id,
        },
      });
    } else {
      await this.prisma.cartItem.update({
        data: {
          quantity: {
            decrement: updateCartItemQuantityDto.quantity,
          },
        },
        where: {
          id: updateCartItemQuantityDto.id,
        },
      });
    }

    return 'Item updated';
  }

  async deleteCartItem(cartItemId: string, userId: string): Promise<String> {
    await this.prisma.cartItem.delete({
      where: {
        id: cartItemId,
        AND: {
          userId: userId,
        },
      },
    });

    return 'Item removed.';
  }
}
