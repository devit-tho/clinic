import { UserWithoutPassword } from 'lib/entities';

declare module 'express' {
  export interface Request {
    user: UserWithoutPassword;
    token: string;
  }
}
