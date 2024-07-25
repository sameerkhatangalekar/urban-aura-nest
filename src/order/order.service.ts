import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Order, OrderItem, Status } from '@prisma/client';
import { STRIPE_CLIENT } from 'src/common/constants';
import Stripe from 'stripe';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    @Inject(STRIPE_CLIENT) private stripe: Stripe,
    private cartService: CartService,
  ) {}

  async updateOrderStatus(updateOrderStatusDto: UpdateOrderStatusDto, orderId: string): Promise<Order> {
    const order = await this.prisma.order.update({
      data: {
        status: updateOrderStatusDto.status,
      },
      where: {
        id: orderId,
      },
    });

    return order;
  }

  async cancelOrder(orderId: string): Promise<Order> {
    const order = await this.prisma.order.update({
      data: {
        status: Status.CANCELLED,
      },
      where: {
        id: orderId,
      },
    });

    return order;
  }

  async getOrderById(orderId: string, userId: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
        userId: userId,
      },
    });

    return order;
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        userId: userId,
      },
    });

    return orders;
  }

  async getAllOrders(): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return orders;
  }

  async createOrder(event: Stripe.PaymentIntentSucceededEvent.Data): Promise<Order> {
    const userId = event.object.metadata['userId'];
    const cartObj = await this.cartService.getCartItems(userId);

    const orderItems: OrderItem[] = cartObj.cart.map((item) => {
      return {
        productId: item.productId,
        name: item.product.name,
        brand: item.product.brand,
        quantity: item.quantity,
        description: item.product.description,
        price: item.product.price,
        color: item.color,
        size: item.size,
        images: item.product.images,
      };
    });

    const order = await this.prisma.order.create({
      data: {
        paymentId: event.object.id,
        totalAmount: event.object.amount / 100,
        orderItems: orderItems,
        userId: userId,
        shipping: {
          city: event.object.shipping.address.city,
          contact: event.object.shipping.phone,
          country: event.object.shipping.address.country,
          line_one: event.object.shipping.address.line1,
          name: event.object.shipping.name,
          postal_code: event.object.shipping.address.postal_code,
          state: event.object.shipping.address.state,
        },
      },
    });

    return order;
  }
}
