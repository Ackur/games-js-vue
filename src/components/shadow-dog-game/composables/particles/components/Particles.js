class Particle {
  constructor(game) {
    this.game = game;
    this.markedForDeletion = false;
  }

  update() {
    this.x -= this.speedX + this.game.speed;
    this.y -= this.speedY;
    this.size *= 0.95;
    if (this.size < 0.5) this.markedForDeletion = true;
  }
}

export class Dust extends Particle {
  constructor(game, x, y) {
    super(game);
    this.size = Math.random() * 10 + 10;
    this.x = x;
    this.y = y;
    this.speedX = Math.random();
    this.speedY = Math.random();
    this.color = "rgba(0,0,0,0.1)";
  }
  draw() {
    this.game.ctx.beginPath();
    this.game.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.game.ctx.fillStyle = this.color;
    this.game.ctx.fill();
  }
}

export class Fire extends Particle {
  image = new Image();

  constructor(game, x, y) {
    super(game);
    this.image.src = "./images/shadow-dog/fire.png";
    this.size = Math.random() * 100 + 50;
    this.x = x;
    this.y = y;
    this.speedX = 1;
    this.speedY = 1;
    this.angle = 0;
    this.va = Math.random() * 0.2 - 0.1;
  }
  update() {
    super.update();
    this.angle += this.va;
    this.x += Math.sin(this.angle * 5);
  }
  draw() {
    this.game.ctx.save();
    this.game.ctx.translate(this.x, this.y);
    this.game.ctx.rotate(this.angle);
    this.game.ctx.drawImage(
      this.image,
      -this.size * 0.5,
      -this.size * 0.5,
      this.size,
      this.size
    );
    this.game.ctx.restore();
  }
}

export class Splash extends Particle {
  image = new Image();

  constructor(game, x, y) {
    super(game);
    this.image.src = "./images/shadow-dog/fire.png";
    this.size = Math.random() * 100 + 100;
    this.x = x - this.size * 0.4;
    this.y = y - this.size * 0.5;
    this.speedX = Math.random() * 6 - 4;
    this.speedY = Math.random() * 2 + 1;
    this.gravity = 0;
  }

  update() {
    super.update();
    this.gravity += 0.1;
    this.y += this.gravity;
  }

  draw() {
    this.game.ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
  }
}
