import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Order, Status } from '@prisma/client';
import { STRIPE_CLIENT } from 'src/common/constants';
import Stripe from 'stripe';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    @Inject(STRIPE_CLIENT) private stripe: Stripe,
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
}
