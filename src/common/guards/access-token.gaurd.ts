import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

/*
 * This class searches for strategy named 'jwt' at run time
 */
@Injectable()
export class AccessTokenGaurd extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(), // checks if decorator is added to function
      context.getClass(), // checks if decorator is added to class
    ]);

    if (isPublic) return true;

    return super.canActivate(context);
  }
}
