import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8081,
    // Proxy API calls to Spring Boot backend
    proxy: {
      "/api": {
        target: "http://localhost:8080", // your Spring Boot backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ["chunk-FDMQADGV", "chunk-V4OQ3NZ2"],
  },
  build: {
    sourcemap: true,
    outDir: "dist",
  },
}));
