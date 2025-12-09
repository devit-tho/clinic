import { UserWithoutPassword } from '@repo/entities';

declare module 'express' {
  export interface Request {
    user: UserWithoutPassword;
    token: string;
  }
}
