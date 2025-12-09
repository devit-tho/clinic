import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role as RoleEntities } from '@repo/entities';
import { Request } from 'express';
import { Observable } from 'rxjs';

export const ROLES_KEY = 'roles';
export const Roles = (...role: RoleEntities[]) => SetMetadata(ROLES_KEY, role);

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles =
      this.reflector.get<RoleEntities[]>(ROLES_KEY, context.getHandler()) ||
      this.reflector.get<RoleEntities[]>(ROLES_KEY, context.getClass());

    const { user } = context.switchToHttp().getRequest<Request>();

    if (user.role === RoleEntities.ADMIN) return true;

    return roles.includes(user.role);
  }
}
