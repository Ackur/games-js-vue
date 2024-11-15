export const usePlayerStates = (game, player, inputs) => {
  const { keysNames, isKeyNamePresetInKeys } = inputs;
  const { ArrowDown, ArrowUp, ArrowLeft, ArrowRight, Space } = keysNames;

  const states = {
    SITTING: {
      name: "SITTING",
      enter: () => {
        player.options.frameX = 0;
        player.options.maxFrame = 4;
        player.options.frameY = 5;
        game.speed = game.maxSpeed * 0;
      },
      handleInput: (keys) => {
        if (
          isKeyNamePresetInKeys(ArrowLeft) ||
          isKeyNamePresetInKeys(ArrowRight)
        ) {
          player.setState(states.RUNNING);
        } else if (isKeyNamePresetInKeys(ArrowUp))
          player.setState(states.JUMPING);
        else if (isKeyNamePresetInKeys(Space)) player.setState(states.ROLLING);
      },
    },
    RUNNING: {
      name: "RUNNING",
      enter: () => {
        player.options.frameX = 0;
        player.options.maxFrame = 8;
        player.options.frameY = 3;
        game.speed = game.maxSpeed * 1;
      },
      handleInput: (keys) => {
        if (isKeyNamePresetInKeys(ArrowDown)) player.setState(states.SITTING);
        else if (isKeyNamePresetInKeys(ArrowUp))
          player.setState(states.JUMPING);
        else if (isKeyNamePresetInKeys(Space)) player.setState(states.ROLLING);
      },
    },
    JUMPING: {
      name: "JUMPING",
      enter: () => {
        if (player.isOnGround()) player.options.vy -= 20;
        player.options.frameX = 0;
        player.options.maxFrame = 6;
        player.options.frameY = 1;
        game.speed = game.maxSpeed * 1;
      },
      handleInput: (keys) => {
        if (player.options.vy > player.options.weight)
          player.setState(states.FALLING);
        else if (isKeyNamePresetInKeys(Space)) player.setState(states.ROLLING);
      },
    },
    FALLING: {
      name: "FALLING",
      enter: () => {
        player.options.frameX = 0;
        player.options.maxFrame = 6;
        player.options.frameY = 2;
        game.speed = game.maxSpeed * 1;
      },
      handleInput: (keys) => {
        if (player.isOnGround()) {
          player.setState(states.RUNNING);
        } else if (isKeyNamePresetInKeys(Space))
          player.setState(states.ROLLING);
      },
    },
    ROLLING: {
      name: "ROLLING",
      enter: () => {
        player.options.frameX = 0;
        player.options.maxFrame = 6;
        player.options.frameY = 6;
        game.speed = game.maxSpeed * 2;
      },
      handleInput: (keys) => {
        if (!isKeyNamePresetInKeys(Space) && player.isOnGround()) {
          player.setState(states.RUNNING);
        } else if (!isKeyNamePresetInKeys(Space) && !player.isOnGround()) {
          player.setState(states.FALLING);
        }
      },
    },
  };

  return states;
};
