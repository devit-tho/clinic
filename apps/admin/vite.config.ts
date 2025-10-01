import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), tsconfigPaths(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src/"),
      },
    },
    define: {
      "process.env": JSON.stringify({
        ...env,
      }),
    },
    server: {
      port: 4000,
      strictPort: true,
    },
  };
});
