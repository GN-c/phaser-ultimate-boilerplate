import { Handler } from "./base";
import glslify from "glslify";
import glslOptimizer from "glsl-optimizer-js";

export class GLSLHandler extends Handler {
  supportedExtensions = /.glsl/;
  private readonly delimiter = "---";

  async handle(isDevelopment: boolean, srcPath: string, targetPath: string) {
    const srcGLSL = await this.read(srcPath);
    /** Decompose loaded glsl */
    const { phaserHeaders, GLSLs } = this.decomposePhaserGLSL(srcGLSL);
    /**
     * Compose GLSL Back
     */
    if (isDevelopment)
      await this.write(
        targetPath,
        this.composePhaserGLSL(
          phaserHeaders,
          /** Transform GLSL code */
          GLSLs.map((GLSL) => glslify(GLSL))
        )
      );
    else {
      await this.write(
        targetPath,
        this.composePhaserGLSL(
          phaserHeaders,
          /** Transform GLSL code */
          GLSLs.map(
            (GLSL) => (
              console.log("optimized"),
              this.optimizeGLSL(glslify(GLSL), 2, false)
            )
          )
        )
      );
    }
  }

  private optimizeGLSL = glslOptimizer().cwrap("optimize_glsl", "string", [
    "string",
    "number",
    "boolean",
  ]) as (source: string, shaderType: number, vertexShader: boolean) => string;

  /**
   * Separate phaser headers from shader code
   *
   * Since Phaser acceptable glsl code can also contain code for multiple shaders separated by headers
   * we try splitting code into multiple subparts
   *
   * phaser header is separated from glsl code using '---'
   * you can see example here: https://labs.phaser.io/assets/shaders/bundle2.glsl.js
   *
   */
  private decomposePhaserGLSL(GLSL: string) {
    const phaserHeaders: string[] = [];
    const GLSLs: string[] = [];

    /** Check if we have any header at all */
    if (GLSL.includes(this.delimiter)) {
      /** Remove stuff before starting of first header */
      GLSL.slice(GLSL.indexOf(this.delimiter) + this.delimiter.length)
        /** Split on each delimiter */
        .split(this.delimiter)
        .forEach((str, index) =>
          index % 2 ? GLSLs.push(str) : phaserHeaders.push(str)
        );
      return { phaserHeaders, GLSLs };
    } else return { phaserHeaders: [""], GLSLs: [GLSL] };
  }

  /**
   * Combine headers and glsl into Phaser acceptable code
   */
  private composePhaserGLSL(phaserHeaders: string[], GLSLs: string[]) {
    /** Check if we have any header at all, since it's not mandatory */
    if (phaserHeaders.length) {
      let GLSL = "";
      for (let i = 0; i < GLSLs.length; i++)
        GLSL += "---" + phaserHeaders[i] + "---" + GLSLs[i];
      return GLSL;
      /** Otherwise simply return glsl code  */
    } else return GLSLs[0];
  }
}
