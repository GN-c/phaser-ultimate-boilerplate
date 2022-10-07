import { Handler } from "./base";

export class JSONHandler extends Handler {
  supportedExtensions = /.json/;

  async handle(isDevelopment: boolean, srcPath: string, targetPath: string) {
    if (isDevelopment) this.copy(srcPath, targetPath);
    else {
      const content = await this.read(srcPath);
      await this.write(targetPath, JSON.stringify(JSON.parse(content)));
    }
  }
}
