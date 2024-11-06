import { getRandomColor } from "../../../utils";
import { Particle } from "./Particle";

let particles = [];
const ravenImage = new Image();
ravenImage.src = "/images/shadow-dog/enemies/raven.png";

export class Raven {
  constructor(canvasWidth, canvasHeight) {
    this.spriteWidth = 271;
    this.spriteHeight = 194;
    this.sizeModifier = Math.random() * 0.6 + 0.4;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.x = canvasWidth;
    this.y = Math.random() * (canvasHeight - this.height);
    this.directionX = Math.random() * 5 + 3;
    this.directionY = Math.random() * 5 - 2.5;
    this.frame = 0;
    this.maxFrame = 4;
    this.timeSinceFlap = 0;
    this.flapInterval = Math.random() * 50 + 50;
    this.color = getRandomColor();
    this.markedForDeletion = false;
    this.hasTrail = Math.random() > 0.5;
  }

  update(ctx, ctxCollision, deltaTime) {
    if (this.x + this.width < 0) {
      this.markedForDeletion = true;
      return;
    }

    if (this.y < 0 || this.y > this.canvasHeight - this.height) {
      this.directionY = this.directionY * -1;
    }

    this.x -= this.directionX;
    this.y += this.directionY;

    this.timeSinceFlap += deltaTime;

    if (this.timeSinceFlap > this.flapInterval) {
      if (this.frame > this.maxFrame) {
        this.frame = 0;
      } else {
        this.frame++;
      }
      this.timeSinceFlap = 0;
    }

    if (this.hasTrail) {
      particles.push(
        new Particle(this.x, this.y, this.width, this.color.style)
      );
      particles.forEach((el) => el.update(ctx));
      particles = particles.filter((el) => !el.markedForDeletion);
    }

    ctxCollision.fillStyle = this.color.style;

    ctxCollision.fillRect(this.x, this.y, this.width, this.height);

    ctx.drawImage(
      ravenImage,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  draw() {}
}
