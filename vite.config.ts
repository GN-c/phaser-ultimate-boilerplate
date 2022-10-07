import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import assetOptimizationPlugin from "./vite/AssetOptimization";

export default defineConfig({
  publicDir: "assets",
  server: {
    port: 3000,
  },
  build: {
    outDir: "build",
  },
  esbuild: {
    legalComments: "none",
  },
  plugins: [tsconfigPaths(), assetOptimizationPlugin()],
});
