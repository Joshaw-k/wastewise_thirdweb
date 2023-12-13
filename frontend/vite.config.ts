import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    global: "globalThis",
    "process.env": {},
  },
  resolve: {
    alias: {
      process: "process/browser",
      util: "util",
    },
  },
  plugins: [react(), nodePolyfills()],
});
