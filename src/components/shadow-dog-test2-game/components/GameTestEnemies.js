export class GameTestEnemies {
  constructor(ctx) {
    this.ctx = ctx;
    this.width = this.ctx.canvas.width;
    this.height = this.ctx.canvas.height;
    this.enemies = [];
    this.enemyInterval = 500;
    this.enemyTimer = 0;
    this.enemyTypes = ["worm", "ghost", "spider"];
  }
  update(deltaTime) {
    this.enemies = this.enemies.filter((obj) => !obj.markedForDeletion);

    if (this.enemyTimer > this.enemyInterval) {
      this.#addNewEnemy();
      this.enemyTimer = 0;
      console.log(this.enemies);
    } else {
      this.enemyTimer += deltaTime;
    }
    this.enemies.forEach((obj) => obj.update(deltaTime));
  }
  draw() {
    this.enemies.forEach((obj) => obj.draw());
  }

  #addNewEnemy() {
    const randomEnemy =
      this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
    if (randomEnemy === "worm") this.enemies.push(new Worm(this));
    else if (randomEnemy === "ghost") this.enemies.push(new Ghost(this));
    else if (randomEnemy === "spider") this.enemies.push(new Spider(this));
    // this.enemies.sort((a, b) => a.y - b.y);
  }
}

class Enemy {
  constructor(game) {
    this.game = game;
    this.frameX = 0;
    this.maxFrame = 5;
    this.frameInterval = 100;
    this.frameTimer = 0;
    this.markedForDeletion = false;
  }
  update(deltaTime) {
    this.x -= this.speedX * deltaTime;
    if (this.x + this.width < 0) {
      this.markedForDeletion = true;
    }
    if (this.frameTimer > this.frameInterval) {
      if (this.frameX < this.maxFrame) this.frameX++;
      else this.frameX = 0;
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }
  }
  draw() {
    this.game.ctx.drawImage(
      this.image,
      this.frameX * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

class Worm extends Enemy {
  image = new Image();

  constructor(game) {
    super(game);
    this.image.src = "/images/shadow-dog/enemies/enemy_worm.png";
    this.spriteWidth = 229;
    this.spriteHeight = 171;
    this.width = this.spriteWidth / 2;
    this.height = this.spriteHeight / 2;
    this.x = this.game.width;
    this.y = this.game.height - this.height;
    this.speedX = Math.random() * 0.1 + 0.1;
  }
}

class Ghost extends Enemy {
  image = new Image();

  constructor(game) {
    super(game);
    this.image.src = "/images/shadow-dog/enemies/enemy_ghost.png";
    this.spriteWidth = 261;
    this.spriteHeight = 209;
    this.width = this.spriteWidth / 2;
    this.height = this.spriteHeight / 2;
    this.x = this.game.width;
    this.y = Math.random() * this.game.height * 0.6;
    this.speedX = Math.random() * 0.2 + 0.1;
    this.angle = 0;
    this.curve = Math.random() * 3;
  }

  update(deltaTime) {
    super.update(deltaTime);
    this.y += Math.sin(this.angle) * this.curve;
    this.angle += 0.04;
  }

  draw() {
    this.game.ctx.save();
    this.game.ctx.globalAlpha = 0.6;
    super.draw();
    this.game.ctx.restore();
  }
}

class Spider extends Enemy {
  image = new Image();

  constructor(game) {
    super(game);
    this.image.src = "/images/shadow-dog/enemies/enemy_spider.png";
    this.spriteWidth = 310;
    this.spriteHeight = 175;
    this.width = this.spriteWidth / 2;
    this.height = this.spriteHeight / 2;
    this.x = Math.random() * (this.game.width - this.width);
    this.y = 0 - this.height;
    this.speedX = 0;
    this.speedY = Math.random() * 0.1 + 0.1;
    this.maxLength = Math.random() * (this.game.height - this.height);
  }

  update(deltaTime) {
    super.update(deltaTime);
    if (this.y + this.height < 0) {
      this.markedForDeletion = true;
    }
    this.y += this.speedY * deltaTime;
    if (this.y > this.maxLength) this.speedY *= -1;
  }

  draw() {
    this.game.ctx.beginPath();
    this.game.ctx.moveTo(this.x + this.width / 2, 0);
    this.game.ctx.lineTo(this.x + this.width / 2, this.y + 10);
    this.game.ctx.stroke();
    super.draw();
  }
}
