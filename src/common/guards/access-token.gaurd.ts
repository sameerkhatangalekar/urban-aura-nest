import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FIREBASE_CLIENT } from '../constants';
import * as admin from 'firebase-admin';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccessTokenGaurd implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(FIREBASE_CLIENT) private readonly firebaseKey: admin.app.App,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(), // checks if decorator is added to function
      context.getClass(), // checks if decorator is added to class
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    try {
      const payload = await this.firebaseKey.auth().verifyIdToken(token);
      if (payload.firebase.sign_in_provider === 'custom') {
        request['user'] = payload;
      } else {
        const user = await this.prisma.user.findUnique({
          where: {
            uid: payload.uid,
          },
        });

        payload.uid = user.id;
        payload.sub = user.id;
        payload.user_id = user.id;
        request['user'] = payload;
      }
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
