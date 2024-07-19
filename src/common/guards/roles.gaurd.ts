import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGaurd implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride('roles', [context.getHandler(), context.getClass()]);

    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const hasAllPrivileges = roles.every((role: Role) => user.roles.includes(role));

    return hasAllPrivileges;
  }
}
