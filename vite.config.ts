import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint";
import svgr from "vite-plugin-svgr";
import { transformMarkdown } from "./transformMarkdown";

export default defineConfig({
  plugins: [
    react(),
    transformMarkdown(),
    svgr(),
    eslint({ lintOnStart: true, include: ["src/**/*.{ts,tsx}"] }),
  ],
  base: "/thoughts/",
  publicDir: "entries/",
  resolve: {
    alias: {
      src: path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "build",
  },
  server: {
    port: 3000,
  },
});
