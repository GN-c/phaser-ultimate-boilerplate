import fs from "fs-extra";

export abstract class Handler {
  public abstract readonly supportedExtensions: RegExp;

  abstract handle(
    isDevelopment: boolean,
    srcPath: string,
    targetPath: string
  ): Promise<void>;

  protected async read(
    srcPath: string,
    encoding: BufferEncoding | string = "utf8"
  ) {
    return await fs.readFile(srcPath, encoding);
  }
  protected async write(
    targetPath: string,
    data: any,
    encoding: BufferEncoding | string = "utf8"
  ) {
    return await fs.outputFile(targetPath, data, encoding);
  }

  protected async copy(srcPath: string, targetPath: string) {
    await fs.copy(srcPath, targetPath);
  }
}
