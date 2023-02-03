import type { Pane } from "tweakpane";

export interface GameDebugConfig {
  disabled?: boolean;
  title?: string;
  expanded?: boolean;
  debugFPS?: boolean;
  debugStepMS?: boolean;
}

export default function GameDebug({
  disabled = false,
  title,
  expanded,
  debugFPS = true,
  debugStepMS = true,
}: GameDebugConfig = {}) {
  return (Game: typeof Phaser.Game) =>
    /**
     * Return Same Class Constructor if Disabled
     */
    disabled
      ? Game
      : class extends Game {
          tweakPane?: Pane;

          constructor(...args: any[]) {
            super(...args);

            /**
             * Create TweakPane once Game is ready
             */
            this.events.once(Phaser.Core.Events.READY, async () => {
              /**
               * Dynamically Import
               */
              const { Pane } = await import("tweakpane");

              /**
               * Create TweakPane
               */
              this.tweakPane = new Pane({
                title: title || this.config.gameTitle || "Debug",
                expanded,
              });

              /**
               * Add FPS Graph
               */
              if (debugFPS)
                this.tweakPane.addMonitor(this.loop, "actualFps", {
                  view: "graph",
                  bufferSize: 20,
                  interval: 1000 / this.loop.targetFps,
                  format: (n) => `${n.toFixed(0)} fps`,
                  label: "FPS",
                });

              /**
               * Add Step MS Graph
               */
              if (debugStepMS)
                this.tweakPane.addMonitor(this, "stepMS", {
                  view: "graph",
                  bufferSize: 20,
                  interval: 1000 / this.loop.targetFps,
                  label: "Step MS",
                  max: 1000 / 60,
                  min: 0,
                  format: (n) => `${n.toFixed(2)} ms`,
                });
            });
          }

          stepMS = 0;
          step(time: number, delta: number): void {
            const t = performance.now();
            super.step(time, delta);
            /**
             * Calculate MSs needed for each step
             */
            this.stepMS = performance.now() - t;
          }

          destroy(removeCanvas: boolean, noReturn?: boolean | undefined): void {
            if (removeCanvas) this.tweakPane?.dispose();
            super.destroy(removeCanvas, noReturn);
          }
        };
}
