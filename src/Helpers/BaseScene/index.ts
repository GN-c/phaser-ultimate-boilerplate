import Game from "@Game";

/**
 * Base Scene class for all main scenes
 */
export default abstract class BaseScene extends Phaser.Scene {
  declare renderer: Phaser.Renderer.WebGL.WebGLRenderer;
  declare game: Game;

  constructor(key: string) {
    super(key);
  }
}
