import BaseScene from "@Helpers/BaseScene";

export class PreloadScene extends BaseScene {
  constructor() {
    super("Preload");
  }

  /**
   * Load Stuff for showing only Loading scene
   */
  preload() {
    this.load.text("test", "test.json");
  }

  create() {
    /**
     * Start next scene
     */
    console.log(this.cache.text.get("test"));
    this.scene.start("Game");
  }
}
