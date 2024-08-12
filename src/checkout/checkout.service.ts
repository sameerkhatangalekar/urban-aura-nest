import { Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { CartService } from 'src/cart/cart.service';
import { STRIPE_CLIENT } from 'src/common/constants';
import Stripe from 'stripe';
import { CheckoutDto } from './dto';
import { CurrentUserDto } from 'src/common/dto';
import { StripTransactionKeys } from 'src/common/types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly cartService: CartService,
    @Inject(STRIPE_CLIENT) private readonly stripe: Stripe,
    private readonly config: ConfigService,
  ) {}

  async checkout(checkoutDto: CheckoutDto, user: CurrentUserDto): Promise<StripTransactionKeys> {
    const cartObj = await this.cartService.getCartItems(user.sub);

    if (cartObj.cart.length <= 0) {
      throw new NotAcceptableException('Cart is empty');
    }

    const intent = await this.stripe.paymentIntents.create({
      description: 'Ecommerce',
      amount: cartObj.cartTotal * 100,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: user.sub,
      },
      shipping: {
        name: checkoutDto.name,
        phone: checkoutDto.contact.toString(),
        address: {
          city: checkoutDto.city,
          line1: checkoutDto.line_one,
          country: checkoutDto.country,
          postal_code: checkoutDto.postal_code,
          state: checkoutDto.state,
        },
      },
      receipt_email: user.email,
    });

    return {
      clientSecret: intent.client_secret,
      publishableKey: this.config.get('STRIPE_PUBLISHABLE_KEY'),
    };
  }
}
