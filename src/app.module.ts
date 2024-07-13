import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGaurd } from './common/guards';
import { RolesGaurd } from './common/guards/roles.gaurd';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
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
