import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { UpdateOrderStatusDto } from './dto';
import { GetCurrentUser, Public, Roles } from 'src/common/decorators';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('order')
@ApiTags('Orders')
@ApiBearerAuth()
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Put('/admin/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<string> {
    console.log('updateOrderStatus called');
    const order = await this.orderService.updateOrderStatus(updateOrderStatusDto, orderId);

    return 'Order status updated';
  }

  @Put('/cancel/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  async cancelOrder(@Param('id') orderId: string): Promise<string> {
    console.log('cancelOrder called');
    const order = await this.orderService.cancelOrder(orderId);
    // TODO trigger repayment through stripe
    return 'Order cancelled';
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getOrderById(@Param('id') orderId: string, @GetCurrentUser('sub') userId: string) {
    console.log('getOrderById called');
    const order = await this.orderService.getOrderById(orderId, userId);

    return order;
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getOrdersByUser(@GetCurrentUser('sub') userId: string) {
    console.log('getOrdersByUser called');
    const orders = await this.orderService.getOrdersByUser(userId);

    return orders;
  }

  @Get('/admin/all')
  @Roles(['ADMIN'])
  @HttpCode(HttpStatus.OK)
  async getAllOrders() {
    console.log('getAllOrders called');
    const orders = await this.orderService.getAllOrders();

    return orders;
  }
}
