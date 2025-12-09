import { excludeFields, Role } from "@repo/entities";
import { z } from "zod";
import {
  PermissionSchema,
  PermissionType,
  RoleSchema,
  UserSchema as UserSchemaGenerated,
  UserType,
} from "./generated";
import { ObjectIdSchema } from "./utils";

// ----------------------------------------------------------------------

const UserSchema = UserSchemaGenerated.extend({
  id: ObjectIdSchema(),
  role: RoleSchema.catch(Role.STAFF),
}).omit({
  ...excludeFields,
});

export { PermissionSchema, UserSchema };

export type { PermissionType, UserType };

// ----------------------------------------------------------------------

export const CreateOrUpdatePermissionSchema = z.object({
  datas: z.array(
    PermissionSchema.pick({
      id: true,
      resource: true,
      actions: true,
    }).partial({ id: true })
  ),
});

export type CreateOrUpdatePermissionType = z.infer<
  typeof CreateOrUpdatePermissionSchema
>;

// ----------------------------------------------------------------------

export const CreateUserSchema = UserSchema.omit({
  id: true,
  createdAt: true,
  username: true,
  alias: true,
}).extend({
  toggle: z.boolean(),
  password: z.string(),
});

export type CreateUserType = z.infer<typeof CreateUserSchema>;

// ----------------------------------------------------------------------

export const UpdateUserSchema = UserSchema.omit({
  id: true,
  username: true,
  password: true,
  createdAt: true,
  alias: true,
});

export type UpdateUserType = z.infer<typeof UpdateUserSchema>;

// ----------------------------------------------------------------------

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string(),
    newPassword: z.string(),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordType = z.infer<typeof ChangePasswordSchema>;

// ----------------------------------------------------------------------

export const ResetPasswordSchema = UserSchema.pick({
  password: true,
}).extend({
  userId: ObjectIdSchema(),
});

export type ResetPasswordType = z.infer<typeof ResetPasswordSchema>;

// ----------------------------------------------------------------------

export const LoginSchema = UserSchema.pick({
  username: true,
  password: true,
}).extend({
  device: z.string(),
});

export type LoginType = z.infer<typeof LoginSchema>;

// ----------------------------------------------------------------------
