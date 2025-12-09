export { db } from "./client";

export * from "../prisma/generated/client";
export {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "../prisma/generated/internal/prismaNamespace";
