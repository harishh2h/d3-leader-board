import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  // GitHub project Pages: set VITE_BASE_PATH=/your-repo-name/ in CI (with slashes).
  base: process.env.VITE_BASE_PATH ?? "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "::",
    port: 5174,
  },
});
