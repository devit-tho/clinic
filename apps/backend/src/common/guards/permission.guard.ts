import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@repo/entities';
import { Action, Resource } from '@repo/permissions';
import { Request } from 'express';
import { Observable } from 'rxjs';

interface PermissionProps {
  resource: Resource;
  actions: Action | Action[];
}

export const permission = 'permission';
export const Permissions = ({ resource, actions }: PermissionProps) =>
  SetMetadata(permission, { resource, actions });

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const data =
      this.reflector.get<PermissionProps>(permission, context.getHandler()) ||
      this.reflector.get<PermissionProps>(permission, context.getClass());

    const { user } = context.switchToHttp().getRequest<Request>();

    if (!user) return false;

    if (user.role === Role.ADMIN) return true;

    const requiredActions = Array.isArray(data.actions)
      ? data.actions
      : [data.actions];

    const correctResource = user.permissions.find(
      (permission) => permission.resource === data.resource,
    );

    if (!correctResource) return false;

    const correctActions = correctResource.actions.some((action) =>
      requiredActions.includes(action as Action),
    );

    return correctActions;
  }
}
