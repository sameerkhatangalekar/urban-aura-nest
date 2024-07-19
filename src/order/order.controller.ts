import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { UpdateOrderStatusDto } from './dto';
import { GetCurrentUser, Public, Roles } from 'src/common/decorators';
import { STRIPE_CLIENT } from 'src/common/constants';
import Stripe from 'stripe';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('order')
@ApiTags('Orders')
@ApiBearerAuth()
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Put('/admin/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  updateOrderStatus(@Param('id') orderId: string, @Body() updateOrderStatusDto: UpdateOrderStatusDto): string {
    console.log('updateOrderStatus called');
    const order = this.orderService.updateOrderStatus(updateOrderStatusDto, orderId);

    return 'Order status updated';
  }

  @Put('/cancel/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  cancelOrder(@Param('id') orderId: string): string {
    console.log('cancelOrder called');
    const order = this.orderService.cancelOrder(orderId);
    // TODO trigger repayment through stripe
    return 'Order cancelled';
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOrderById(@Param('id') orderId: string, @GetCurrentUser('sub') userId: string) {
    console.log('getOrderById called');
    const order = this.orderService.getOrderById(orderId, userId);

    return order;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getOrdersByUser(@GetCurrentUser('sub') userId: string) {
    console.log('getOrdersByUser called');
    const orders = this.orderService.getOrdersByUser(userId);

    return orders;
  }

  @Get('/admin/all')
  @Roles(['ADMIN'])
  @HttpCode(HttpStatus.OK)
  getAllOrders() {
    console.log('getAllOrders called');
    const orders = this.orderService.getAllOrders();

    return orders;
  }
}
