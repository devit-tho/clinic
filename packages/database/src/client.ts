import "dotenv/config";
import { PrismaClient } from "../prisma/generated/client";

declare global {
  var db: PrismaClient | undefined;
}

export const db = global.db || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.db = db;
