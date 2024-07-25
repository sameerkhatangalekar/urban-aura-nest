import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGaurd } from './common/guards';
import { RolesGaurd } from './common/guards/roles.gaurd';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { StripeModule } from './stripe/stripe.module';
import { WebhookModule } from './webhook/webhook.module';
import { CheckoutModule } from './checkout/checkout.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ProductModule,
    CartModule,
    OrderModule,
    StripeModule.forRoot(new ConfigService().get('STRIPE_SECRET'), { apiVersion: '2024-06-20' }),
    WebhookModule,
    CheckoutModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGaurd,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGaurd,
    },
  ],
  exports: [ConfigModule],
})
export class AppModule {}
