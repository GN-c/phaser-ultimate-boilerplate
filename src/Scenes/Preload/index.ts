import BaseScene from "@Helpers/BaseScene";

export class PreloadScene extends BaseScene {
  constructor() {
    super("Preload");
  }

  preload() {}

  create() {
    /**
     * Start next scene
     */
    this.scene.start("Game");
  }
}
