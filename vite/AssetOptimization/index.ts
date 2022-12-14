import { viteStaticCopy } from "vite-plugin-static-copy";

import { JSONHandler, Handler, GLSLHandler } from "./Handlers";

export default function assetOptimizationPlugin() {
  const isProduction = process.env.NODE_ENV == "production";
  const handlers: readonly Handler[] = [
    new JSONHandler(isProduction),
    new GLSLHandler(isProduction),
  ];

  return viteStaticCopy({
    targets: [
      {
        src: "assets/*",
        dest: "./assets/",
        async transform(content, fileName) {
          /** Find appropriate handler */
          const handler = handlers.find((handler) =>
            handler.supportedExtensions.test(fileName)
          );
          if (handler)
            try {
              return await handler.handle(content);
            } catch {
              return content;
            }
          /** Return null to not copy because of incorrect output format */
          return null;
        },
      },
      {
        src: "assets/*",
        dest: "./assets/",
        transform: {
          encoding: "buffer",
          /**
           * Copy All non-handler supported stuff
           */
          async handler(content, fileName) {
            /** Find appropriate handler */
            const handler = handlers.find((handler) =>
              handler.supportedExtensions.test(fileName)
            );
            if (handler) return null;
            else return content;
          },
        },
      },
    ],
  });
}
