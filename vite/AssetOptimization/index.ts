import { Plugin, ResolvedConfig } from "vite";
import fs from "fs-extra";
import path from "path";
import { JSONHandler, Handler, GLSLHandler } from "./Handlers";

const handlers: readonly Handler[] = [new JSONHandler(), new GLSLHandler()];

export default function assetOptimizationPlugin(): Plugin {
  let config: ResolvedConfig, isDevelopment: boolean;

  return {
    name: "asset-optimization",
    enforce: "post",
    configResolved(resolvedConfig) {
      config = resolvedConfig;
      isDevelopment = config.mode == "development";
    },
    async writeBundle() {
      /** Read directory contents */
      const files = fs.readdirSync(config.publicDir);
      /**
       * Go through each file and transform them
       */
      for await (const file of files) {
        const absoluteFilePath = path.join(config.publicDir, file);
        const absoluteTargetFilePath = path.join(config.build.outDir, file);
        const ext = file.slice(file.indexOf("."));
        /** Find appropriate handler */
        const handler = handlers.find((handler) =>
          handler.supportedExtensions.test(ext)
        );
        if (handler)
          await handler.handle(
            isDevelopment,
            absoluteFilePath,
            absoluteTargetFilePath
          );
      }
    },
  };
}
