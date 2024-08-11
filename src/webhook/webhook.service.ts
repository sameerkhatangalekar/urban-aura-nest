import { Inject, Injectable } from '@nestjs/common';
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

  handleWebhookNotification(signature: string, payload: string) {
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

      default:
        console.log(`non ${event.type} `);
        break;
    }
  }

  async handlePaymentSuccess(event: Stripe.PaymentIntentSucceededEvent.Data) {
    const order = await this.orderService.createOrder(event);
    //TODO delete cart
  }
}
