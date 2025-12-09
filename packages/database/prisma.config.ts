import "dotenv/config";
import path from "node:path";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  migrations: {
    seed: "ts-node -P tsconfig.json ./seeds/index.ts",
  },
  schema: path.join("prisma"),
  datasource: {
    url: env("DATABASE_URL"),
  },
});
