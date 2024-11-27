const image = new Image();
image.src = "./images/shadow-dog/boom.png";

export class Explosion {
  constructor(x, y, size) {
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.width = this.spriteWidth * 0.7;
    this.height = this.spriteHeight * 0.7;
    this.size = size * 0.7;
    this.x = x;
    this.y = y;
    this.frame = 0;
    this.timer = 0;
    this.angle = Math.random() * 6.2;
    this.markedForDeletion = false;
  }

  update(ctx) {
    this.timer++;
    if (this.timer % 10 === 0) {
      this.frame++;
      if (this.frame > 5) this.markedForDeletion = true;
    }

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    ctx.drawImage(
      image,
      this.spriteWidth * this.frame,
      0,
      this.spriteWidth,
      this.spriteHeight,
      0 - this.size / 2,
      0 - this.size / 2,
      this.size,
      this.size
    );

    ctx.restore();
  }

  draw() {}
}
