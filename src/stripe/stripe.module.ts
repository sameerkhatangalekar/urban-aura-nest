import { DynamicModule, Module, Provider } from '@nestjs/common';
import { STRIPE_CLIENT } from 'src/common/constants';
import Stripe from 'stripe';

@Module({})
export class StripeModule {
  static forRoot(apiKey: string, config: Stripe.StripeConfig): DynamicModule {
    const stripe = new Stripe(apiKey, config);

    const stripeProvider: Provider = {
      provide: STRIPE_CLIENT,
      useValue: stripe,
    };

    return {
      providers: [stripeProvider],
      module: StripeModule,
      global: true,
      exports: [stripeProvider],
    };
  }
}
