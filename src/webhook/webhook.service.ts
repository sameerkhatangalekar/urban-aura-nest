import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CartService } from 'src/cart/cart.service';
import { STRIPE_CLIENT } from 'src/common/constants';
import { OrderService } from 'src/order/order.service';
import { PrismaService } from 'src/prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class WebhookService {
  constructor(
    @Inject(STRIPE_CLIENT) private stripe: Stripe,
    private config: ConfigService,
    private prisma: PrismaService,
    private orderService: OrderService,
  ) {}

  handleWebhookNotification(signature: string, payload: any) {
    try {
      const event = this.stripe.webhooks.constructEvent(payload, signature, this.config.get('END_POINT_SECRET'));

      switch (event.type) {
        case 'payment_intent.created':
          console.log('created');
          break;
        case 'payment_intent.succeeded':
          console.log('succeeded');

          this.handlePaymentSuccess(event.data);
          break;
        case 'payment_intent.canceled':
          console.log('cancelled');
          break;

        case 'charge.refunded':
          console.log('Refunded');

          this.handleRefund(event.data);
          break;

        default:
          console.log(`non ${event.type} `);
          break;
      }
    } catch (error) {
      console.log(error, 'handleWebhook');
      throw new HttpException(`Webhook Error: ${error.message}`, HttpStatus.BAD_REQUEST);
    }
  }

  private async handlePaymentSuccess(event: Stripe.PaymentIntentSucceededEvent.Data) {
    const order = await this.orderService.createOrder(event);
    await this.deleteCart(order.userId);
  }
  private async handleRefund(event: Stripe.ChargeRefundedEvent.Data) {
    const paymentId = event.object.payment_intent;
    await this.prisma.order.update({
      where: {
        paymentId: paymentId.toString(),
      },
      data: {
        refund: {
          status: event.object.status,
          receipt: event.object.receipt_url,
        },
      },
    });
  }

  private async deleteCart(userId: string) {
    await this.prisma.cartItem.deleteMany({
      where: {
        userId: userId,
      },
    });
  }
}
