import { Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Order, OrderItem, Status } from '@prisma/client';
import { STRIPE_CLIENT } from 'src/common/constants';
import Stripe from 'stripe';
import { v4 } from 'uuid';
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
    const canCancel = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });
    if (canCancel.status !== Status.PLACED)
      throw new NotAcceptableException(`Order is already ${canCancel.status} and cannot be cancelled`);

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
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const hour = currentDate.getHours();
    const minute = currentDate.getMinutes();
    const second = currentDate.getSeconds();
    const milliseconds = currentDate.getMilliseconds();
    const uniqueId = v4().substring(0, 8);
    const numericUuid = uniqueId
      .split('-')
      .map((hex) => parseInt(hex, 16))
      .join('');
    const orderId = `${year}${month}${day}-${hour}${minute}${second}-${milliseconds}-${numericUuid}`;

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
        orderId: orderId,
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
