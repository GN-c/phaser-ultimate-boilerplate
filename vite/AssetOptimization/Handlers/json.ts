import { Handler } from "./base";

export class JSONHandler extends Handler {
  supportedExtensions = /.json/;

  async handle(content: string) {
    return this.isDevelopment ? "content" : JSON.stringify(JSON.parse(content));
  }
}
