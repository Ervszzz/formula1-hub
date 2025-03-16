import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/jolpica": {
        target: "https://api.jolpi.ca",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/jolpica/, ""),
        secure: true,
        headers: {
          "User-Agent": "Formula1-App/1.0",
        },
      },
    },
  },
});
