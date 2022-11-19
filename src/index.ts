import Phaser from "phaser";

import "@GameObjects";
import { BootScene, GameScene, PreloadScene } from "@Scenes";

export default class Game extends Phaser.Game {
  constructor(parent: HTMLElement) {
    super({
      type: Phaser.WEBGL,
      disableContextMenu: true,
      transparent: true,
      scale: {
        parent,
        mode: Phaser.Scale.ScaleModes.RESIZE,
      },
      scene: [BootScene, PreloadScene, GameScene],
    });
  }
}
