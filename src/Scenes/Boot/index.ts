import BaseScene from "@Helpers/BaseScene";

export class BootScene extends BaseScene {
  constructor() {
    super("Boot");
  }

  /**
   * Load Stuff for showing only Loading scene
   */
  preload() {}

  create() {
    /**
     * Start next scene
     */
    this.scene.start("PreLoad");
  }
}
