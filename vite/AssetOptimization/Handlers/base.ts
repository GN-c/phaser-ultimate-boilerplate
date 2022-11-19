export abstract class Handler {
  public abstract readonly supportedExtensions: RegExp;

  constructor(public readonly isProduction: boolean) {}

  abstract handle(content: string): Promise<string>;

  get isDevelopment() {
    return !this.isProduction;
  }
}
