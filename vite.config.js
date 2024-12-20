import { defineConfig } from "vite";
import { fileURLToPath, URL } from "url";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "#": fileURLToPath(new URL("./node_modules", import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern" // "modern" | "modern-compiler"
      }
    }
  }
});
