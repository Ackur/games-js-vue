import { useEnemies } from "./enemies/useEnemies";
import { useBackgrounds } from "./useBackgrounds";
import { useContentUI } from "./useContentUI";
import { useInputs } from "./useInputs";
import { usePlayer } from "./usePlayer";

export const useGame = (ctx) => {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const groundMargin = 80;
  const speed = 0;
  const maxSpeed = 3;
  let score = 0;
  let debug = false;
  let fontColor = "black";

  let inputs = null;
  let player = null;
  let backgrounds = null;
  let enemies = null;
  let contentUI = null;

  function update(deltaTime) {
    backgrounds.update(deltaTime);

    enemies.update(deltaTime);

    player.update(deltaTime);
  }

  function draw() {
    backgrounds.draw();

    enemies.draw();

    contentUI.draw();

    player.draw();
  }

  const returnOptions = {
    ctx,
    width,
    height,
    groundMargin,
    speed,
    maxSpeed,
    score,
    fontColor,
    player,
    update,
    draw,
  };

  inputs = useInputs(returnOptions);
  returnOptions.inputs = inputs;

  backgrounds = useBackgrounds(returnOptions);
  returnOptions.backgrounds = backgrounds;

  enemies = useEnemies(returnOptions);
  returnOptions.enemies = enemies;

  contentUI = useContentUI(returnOptions);
  returnOptions.contentUI = contentUI;

  player = usePlayer(returnOptions, inputs);
  returnOptions.player = player;

  return returnOptions;
};
