export class Particle {
  constructor(x, y, size, color) {
    this.size = size;
    this.x = x + this.size * 0.9;
    this.y = y + this.size / 2.5;
    this.radius = Math.random() * (this.size / 10);
    this.maxRadius = Math.random() * 20 + 35;
    this.markedForDeletion = false;
    this.speedX = Math.random() * 1 + 0.5;
    this.color = color;
    this.markedForDeletion = false;
  }

  update(ctx) {
    this.x += this.speedX;
    this.radius += 0.5;
    if (this.radius > this.maxRadius) this.markedForDeletion = true;

    this.draw(ctx);
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
