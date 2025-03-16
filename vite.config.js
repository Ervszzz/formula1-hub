import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/jolpica": {
        target: "https://ergast.com/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/jolpica/, ""),
        secure: true,
        configure: (proxy) => {
          proxy.on("error", (err) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (_, req) => {
            console.log("Sending Request:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req) => {
            console.log(
              "Received Response from:",
              req.url,
              proxyRes.statusCode
            );
          });
        },
        headers: {
          "User-Agent": "Formula1-App/1.0",
        },
      },
    },
  },
});
