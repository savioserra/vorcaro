import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages project site: /vorcaro/ (override com BASE_PATH em CI)
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.BASE_PATH || "/vorcaro/",
  build: { outDir: "dist", assetsDir: "assets" },
  server: { host: true, port: 5173 },
  preview: { host: true, port: 4173 },
});
