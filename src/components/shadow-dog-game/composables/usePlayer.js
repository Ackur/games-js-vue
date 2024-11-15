import { usePlayerStates } from "./usePlayerStates";
import { useParticles } from "./particles/useParticles";

export const usePlayer = (game, inputs) => {
  const { keysNames, isKeyNamePresetInKeys } = inputs;
  const { ArrowLeft, ArrowRight } = keysNames;

  const image = new Image();
  image.src = "/images/shadow-dog/player.png";
  const width = 100;
  const height = 91.3;
  const options = {
    x: 0,
    y: game.height - height - game.groundMargin,
    vy: 0,
    weight: 1,
    speed: 3,
    maxSpeed: 10,
    frameX: 0,
    frameY: 0,
    maxFrame: 0,
  };
  const fps = 20;
  const frameInterval = 1000 / fps;
  let frameTimer = 0;

  let currrentState = null;
  let states = {};

  let particles = {};

  function update(deltaTime) {
    checkCollision();

    // console.log(inputs.keys);

    currrentState.handleInput(inputs.keys);

    // horizontal movement
    options.x += options.speed;
    if (isKeyNamePresetInKeys(ArrowRight)) options.speed = options.maxSpeed;
    else if (isKeyNamePresetInKeys(ArrowLeft))
      options.speed = -options.maxSpeed;
    else options.speed = 0;

    if (options.x < 0) options.x = 0;
    if (options.x > game.width - width) options.x = game.width - width;

    // vertical movement
    options.y += options.vy;
    if (!isOnGround()) options.vy += options.weight;
    else options.vy = 0;

    // sprite animation
    if (frameTimer > frameInterval) {
      frameTimer = 0;
      if (options.frameX < options.maxFrame) options.frameX++;
      else options.frameX = 0;
    } else {
      frameTimer += deltaTime;
    }

    // update Particles
    if (currrentState.name === "RUNNING") {
      particles.addDust(options.x + width / 2, options.y + height);
    }
    if (currrentState.name === "ROLLING") {
      particles.addFire(options.x + width * 0.7, options.y + height * 0.5);
    }
    particles.update();
  }

  function draw() {
    if (game.debug) game.ctx.strokeRect(options.x, options.y, width, height);

    // draw particles
    particles.draw();

    // draw player
    game.ctx.drawImage(
      image,
      options.frameX * width,
      options.frameY * height,
      width,
      height,
      options.x,
      options.y,
      width,
      height
    );
  }

  function checkCollision() {
    game.enemies.enemies.forEach((enemy) => {
      if (
        enemy.x < options.x + width &&
        enemy.x + enemy.width > options.x &&
        enemy.y < options.y + height &&
        enemy.y + enemy.height > options.y
      ) {
        enemy.markedForDeletion = true;
        game.score++;
      }
    });
  }

  function isOnGround() {
    return options.y + height >= game.height - game.groundMargin;
  }

  function setState(state) {
    currrentState = states[state] || state;
    currrentState.enter();
  }
  function init(playerOptions) {
    // init particles
    Object.assign(particles, useParticles(game));
    playerOptions.particles = particles;

    //init states
    states = usePlayerStates(game, playerOptions, inputs);
    setState(states.RUNNING);
  }

  const returnOptions = {
    width,
    height,
    options,
    update,
    draw,
    setState,
    isOnGround,
  };

  init(returnOptions);

  return returnOptions;
};
