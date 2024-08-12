import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    /**
     ** This register configuratio is global, if require this can be configured directly while using JwtService's sign function to configure different secret for refresh token and access token
     */
    JwtModule.register({
      secret: new ConfigService().get('JWT_SECRET'),
      signOptions: {
        expiresIn: 60 * 60 * 8,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
