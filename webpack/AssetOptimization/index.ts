import CopyPlugin from "copy-webpack-plugin";
import { Handler, GLSLHandler } from "./Handlers";
import { AtlasJSONHandler } from "./Handlers/AtlasJSON";

export default class AssetOptimizationPlugin extends CopyPlugin {
  private handlers: readonly Handler[] = [
    // new JSONHandler(this.mode),
    new GLSLHandler(this.mode),
    new AtlasJSONHandler(this.mode),
  ];

  constructor(private readonly mode: "development" | "production") {
    super({
      patterns: [
        {
          from: "assets",
          to: "./",
          transform: async (content, filePath) => {
            /**
             * Find needed handler
             */
            const handler = this.handlers.find((handler) =>
              filePath.endsWith(handler.supportedExtension)
            );
            /**
             * Try running handler if it exists
             * otherwise return same content
             */
            if (handler)
              try {
                return await handler.handle(content);
              } catch (error) {
                console.error(error);
                return content;
              }
            else return content;
          },
        },
      ],
    });
  }
}
