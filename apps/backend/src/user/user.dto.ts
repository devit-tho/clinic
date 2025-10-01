import {
  ChangePasswordSchema,
  CreateOrUpdatePermissionSchema,
  CreateUserSchema,
  LoginSchema,
  ResetPasswordSchema,
  UpdateUserSchema,
} from '@repo/schemas';
import { createZodDto } from 'nestjs-zod';

export class ChangePasswordDto extends createZodDto(ChangePasswordSchema) {}

export class CreateUserDto extends createZodDto(CreateUserSchema) {}

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}

export class ResetPasswordDto extends createZodDto(ResetPasswordSchema) {}

export class LoginUserDto extends createZodDto(LoginSchema) {}

export class PermissionDto extends createZodDto(
  CreateOrUpdatePermissionSchema,
) {}
