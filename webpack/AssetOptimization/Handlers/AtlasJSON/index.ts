import { Handler } from "../base";
import protobuf from "protobufjs";

export class AtlasJSONHandler extends Handler {
  supportedExtension = ".atlas.json";

  async handle(_content: Buffer) {
    const atlasJSON = JSON.parse(_content.toString());

    const data = {
      textures: atlasJSON.textures.map((texture: any) => ({
        image: texture.image,
        frames: texture.frames,
      })),
    };

    const protoRoot = await protobuf.load(
      "webpack/AssetOptimization/Handlers/AtlasJSON/atlas.proto"
    );
    const Tiled = protoRoot.lookupType("TexturePacker.Atlas");

    const error = Tiled.verify(data);
    if (error) throw error;

    console.log("test");

    return Buffer.from(Tiled.encode(data).finish());
  }
}
