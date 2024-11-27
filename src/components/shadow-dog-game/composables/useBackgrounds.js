class Layer {
  image = new Image();
  constructor(game, imageName, width, height, speedModifier) {
    this.game = game;
    this.width = width;
    this.height = height;
    this.speedModifier = speedModifier;
    this.image.src = "./images/shadow-dog/backgroundLayers/" + imageName;
    this.x = 0;
    this.y = 0;
  }
  update() {
    if (this.x < -this.width) this.x = 0;
    else this.x -= this.game.speed * this.speedModifier;
  }
  draw() {
    this.game.ctx.drawImage(
      this.image,
      this.x,
      this.y,
      this.width,
      this.height
    );
    this.game.ctx.drawImage(
      this.image,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );
  }
}

export const useBackgrounds = (game) => {
  const width = 1667;
  const height = 500;
  let layers = [];

  function update() {
    layers.forEach((layer) => layer.update());
  }
  function draw() {
    layers.forEach((layer) => layer.draw());
  }

  function init() {
    layers = [
      new Layer(game, "layer2-1.png", width, height, 0),
      new Layer(game, "layer2-2.png", width, height, 0.2),
      new Layer(game, "layer2-3.png", width, height, 0.4),
      new Layer(game, "layer2-4.png", width, height, 0.8),
      new Layer(game, "layer2-5.png", width, height, 1)
    ];
  }

  init();

  return {
    update,
    draw
  };
};
