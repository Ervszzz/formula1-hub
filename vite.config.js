import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "F1Pulse",
        short_name: "F1Pulse",
        description: "Real-time Formula 1 data interface",
        theme_color: "#080A0F",
        background_color: "#080A0F",
        display: "standalone",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        start_url: "/",
        scope: "/",
      },
    }),
  ],
  server: {
    proxy: {
      "/api/jolpica": {
        target: "https://api.jolpi.ca/ergast",
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
      "/api/ergast": {
        target: "https://ergast.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ergast/, "/api"),
      },
    },
  },
});
