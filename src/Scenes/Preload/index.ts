import BaseScene from "@Helpers/BaseScene";

export class PreloadScene extends BaseScene {
  constructor() {
    super("Preload");
  }

  /**
   * Load Stuff for showing only Loading scene
   */
  preload() {}

  create() {
    /**
     * Start next scene
     */
    this.scene.start("Game");
  }
}
