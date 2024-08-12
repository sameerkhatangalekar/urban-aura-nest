import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { UpdateOrderStatusDto } from './dto';
import { GetCurrentUser, Public, Roles } from 'src/common/decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Order } from '@prisma/client';
import { SuccessType } from 'src/common/types';
import { STRIPE_CLIENT } from 'src/common/constants';
import Stripe from 'stripe';

@Controller('order')
@ApiTags('Orders')
@ApiBearerAuth()
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
  ) {}

  @Put('/admin/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<SuccessType> {
    const order = await this.orderService.updateOrderStatus(updateOrderStatusDto, orderId);
    return {
      message: 'Order status updated',
    };
  }

  @Put('/cancel/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  async cancelOrder(@Param('id') orderId: string): Promise<SuccessType> {
    console.log('cancelOrder called');
    const order = await this.orderService.cancelOrder(orderId);

    const refund = await this.stripe.refunds.create({
      payment_intent: order.paymentId,
      metadata: {
        orderId: order.orderId,
      },
      reason: 'requested_by_customer',
    });

    return { message: 'Order cancelled' };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOrderById(@Param('id') orderId: string, @GetCurrentUser('sub') userId: string) {
    const order = await this.orderService.getOrderById(orderId, userId);

    return order;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getOrdersByUser(@GetCurrentUser('sub') userId: string) {
    const orders = await this.orderService.getOrdersByUser(userId);

    return orders;
  }

  @Get('/admin/all')
  @Roles(['ADMIN'])
  @HttpCode(HttpStatus.OK)
  async getAllOrders() {
    const orders = await this.orderService.getAllOrders();

    return orders;
  }
}
