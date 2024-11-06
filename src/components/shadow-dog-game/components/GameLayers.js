import layerOneImage from "/images/shadow-dog/backgroundLayers/layer-1.png";
import layerTwoImage from "/images/shadow-dog/backgroundLayers/layer-2.png";
import layerThreeImage from "/images/shadow-dog/backgroundLayers/layer-3.png";
import layerFourImage from "/images/shadow-dog/backgroundLayers/layer-4.png";
import layerFiveImage from "/images/shadow-dog/backgroundLayers/layer-5.png";

class GameLayer {
  image = new Image();

  constructor(image, speedModifier, gameSpeed) {
    this.x = 0;
    this.y = 0;
    this.width = 2400;
    this.height = 700;
    this.image.src = image;
    this.speedModifier = speedModifier;
    this.gameSpeed = gameSpeed;
    this.speed = gameSpeed * this.speedModifier;
  }

  update(ctx) {
    this.speed = this.gameSpeed * this.speedModifier;
    if (this.x <= -this.width) {
      this.x = 0;
    }
    this.x = this.x - this.speed;

    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.x + this.width,
      this.y,
      this.width,
      this.height
    );
  }

  draw() {}
}

export class GameLayers {
  layers = {};
  constructor(gameSpeed) {
    this.layers.one = new GameLayer(layerOneImage, 0.2, gameSpeed);
    this.layers.two = new GameLayer(layerTwoImage, 0.4, gameSpeed);
    this.layers.three = new GameLayer(layerThreeImage, 0.6, gameSpeed);
    this.layers.four = new GameLayer(layerFourImage, 0.8, gameSpeed);
    this.layers.five = new GameLayer(layerFiveImage, 1, gameSpeed);
  }

  update(ctx) {
    Object.values(this.layers).forEach((layer) => layer.update(ctx));
  }
}
