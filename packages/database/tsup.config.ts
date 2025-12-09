import { defineConfig } from "tsup";

export default defineConfig(() => ({
  entry: ["src"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  // noExternal: ["@prisma/client", "prisma"],
  // external: ["@prisma/client"],
  // skipNodeModulesBundle: true,
}));
