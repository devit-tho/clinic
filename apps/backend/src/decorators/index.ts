import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const GetUser = createParamDecorator((data, ctx) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  return request.user;
});

export const GetToken = createParamDecorator((data, ctx) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  return request.token;
});
