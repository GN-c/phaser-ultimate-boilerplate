import { Plugin, ResolvedConfig } from "vite";
import fs from "fs-extra";
import path from "path";
import { JSONHandler, Handler, GLSLHandler } from "./Handlers";

const handlers: readonly Handler[] = [new JSONHandler(), new GLSLHandler()];

export default function assetOptimizationPlugin(): Plugin {
  let publicDir: string, buildDir: string, isDevelopment: boolean;

  return {
    name: "asset-optimization",
    enforce: "post",
    config(this, config, env) {
      /**
       * Get all needed data from config
       */
      isDevelopment = env.mode == "development";
      publicDir = config.publicDir || ".";
      buildDir = config.build?.outDir || "dist";
      /**
       * If in development change static folder path to buildDirectory where optimized assets will be placed
       * otherwise set to false to disable copying static files by vite
       */
      config.publicDir = false; //isDevelopment ? buildDir : false;
    },
    async closeBundle() {
      /** Read directory contents */
      const files = fs.readdirSync(publicDir);
      /**
       * Go through each file and transform them
       */
      for await (const file of files) {
        const absoluteFilePath = path.join(publicDir, file);
        const absoluteTargetFilePath = path.join(buildDir, file);
        const ext = file.slice(file.indexOf("."));
        /** Find appropriate handler */
        const handler = handlers.find((handler) =>
          handler.supportedExtensions.test(ext)
        );
        if (handler) {
          console.log(`Optimizing ${file}`);
          try {
            await handler.handle(
              isDevelopment,
              absoluteFilePath,
              absoluteTargetFilePath
            );
          } catch (error) {
            console.log(`Optimizing ${file} failed: `, error);
          }
        } else
          console.log(
            `Couldn't find optimizer for ${file}, directly copying it`
          );
      }
    },
  };
}
