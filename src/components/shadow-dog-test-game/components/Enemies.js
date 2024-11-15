import enemyOneImage from "/images/shadow-dog/enemies/enemy1.png";
import enemyTwoImage from "/images/shadow-dog/enemies/enemy2.png";
import enemyThreeImage from "/images/shadow-dog/enemies/enemy3.png";
import enemyFourImage from "/images/shadow-dog/enemies/enemy4.png";

let gameFrame = 0;

class Enemy {
  image = new Image();

  constructor(imageSrc, canvasWidth, canvasHeight) {
    this.image.src = imageSrc;
    this.spriteWidth = 293;
    this.spriteHeight = 155;
    this.width = this.spriteWidth / 3;
    this.height = this.spriteHeight / 3;
    this.x = Math.random() * (canvasWidth - this.width);
    this.y = Math.random() * (canvasHeight - this.height);
    this.frame = 0;
    this.flapSpeed = Math.floor(Math.random() * 3 + 1);
  }
  update(ctx) {
    this.x += Math.random() * 5 - 2.5; //this.speed;
    this.y += Math.random() * 5 - 2.5;

    if (gameFrame % this.flapSpeed === 0)
      this.frame > 4 ? (this.frame = 0) : this.frame++;

    ctx.drawImage(
      this.image,
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
}

class EnemyTwo {
  image = new Image();

  constructor(imageSrc, canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.image.src = imageSrc;
    this.spriteWidth = 266;
    this.spriteHeight = 188;
    this.width = this.spriteWidth / 2;
    this.height = this.spriteHeight / 2;
    this.x = Math.random() * (canvasWidth - this.width);
    this.y = Math.random() * (canvasHeight - this.height);
    this.frame = 0;
    this.speed = Math.random() * 4 + 1;
    this.flapSpeed = Math.floor(Math.random() * 3 + 1);
    this.angle = 0;
    this.angleSpeed = Math.random() * 0.2;
    this.curve = Math.random() * 7;
  }
  update(ctx) {
    this.x -= this.speed;
    this.y += this.curve * Math.sin(this.angle);
    this.angle += this.angleSpeed;

    if (this.x + this.width < 0) this.x = this.canvasWidth;

    if (gameFrame % this.flapSpeed === 0)
      this.frame > 4 ? (this.frame = 0) : this.frame++;

    ctx.drawImage(
      this.image,
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
}

class EnemyThree {
  image = new Image();

  constructor(imageSrc, canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.image.src = imageSrc;
    this.spriteWidth = 218;
    this.spriteHeight = 177;
    this.width = this.spriteWidth / 2;
    this.height = this.spriteHeight / 2;
    this.x = Math.random() * (canvasWidth - this.width);
    this.y = Math.random() * (canvasHeight - this.height);
    this.frame = 0;
    this.speed = Math.random() * 4 + 1;
    this.flapSpeed = Math.floor(Math.random() * 3 + 1);
    this.angle = Math.random() * 500;
    this.angleSpeed = Math.random() * 0.5 + 0.5;
  }
  update(ctx) {
    this.x =
      (this.canvasWidth / 2) * Math.cos((this.angle * Math.PI) / 180) +
      (this.canvasWidth / 2 - this.width / 2);
    this.y =
      (this.canvasHeight / 2) * Math.sin((this.angle * Math.PI) / 200) +
      (this.canvasHeight / 2 - this.height / 2);
    this.angle += this.angleSpeed;

    if (this.x + this.width < 0) this.x = this.canvasWidth;

    if (gameFrame % this.flapSpeed === 0)
      this.frame > 4 ? (this.frame = 0) : this.frame++;

    ctx.drawImage(
      this.image,
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
}

class EnemyFour {
  image = new Image();

  constructor(imageSrc, canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.image.src = imageSrc;
    this.spriteWidth = 213;
    this.spriteHeight = 213;
    this.width = this.spriteWidth / 2;
    this.height = this.spriteHeight / 2;
    this.x = Math.random() * (canvasWidth - this.width);
    this.y = Math.random() * (canvasHeight - this.height);
    this.newX = Math.random() * canvasWidth;
    this.newY = Math.random() * canvasHeight;
    this.frame = 0;
    this.speed = Math.random() * 4 + 1;
    this.flapSpeed = Math.floor(Math.random() * 3 + 1);
    this.interval = Math.floor(Math.random() * 200 + 50);
  }
  update(ctx) {
    if (gameFrame % this.interval === 0) {
      this.newX = Math.random() * (this.canvasWidth - this.width);
      this.newY = Math.random() * (this.canvasHeight - this.height);
    }
    let dx = this.x - this.newX;
    let dy = this.y - this.newY;
    this.x -= dx / 70;
    this.y -= dy / 70;

    if (this.x + this.width < 0) this.x = this.canvasWidth;

    if (gameFrame % this.flapSpeed === 0)
      this.frame > 4 ? (this.frame = 0) : this.frame++;

    ctx.drawImage(
      this.image,
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
}

export class GameEnemies {
  enemies = [];

  constructor(canvasWidth, canvasHeight, enemiesCount = 5) {
    this.enemiesCount = enemiesCount;

    this.init(canvasWidth, canvasHeight);
  }

  update(ctx) {
    this.enemies.forEach((enemy) => {
      enemy.update(ctx);
    });
    gameFrame++;
  }

  init(canvasWidth, canvasHeight) {
    for (let i = 0; i < 5; i++) {
      this.enemies.push(
        new EnemyFour(enemyFourImage, canvasWidth, canvasHeight)
      );
    }
    for (let i = 0; i < 5; i++) {
      this.enemies.push(
        new EnemyThree(enemyThreeImage, canvasWidth, canvasHeight)
      );
    }
    for (let i = 0; i < 5; i++) {
      this.enemies.push(new EnemyTwo(enemyTwoImage, canvasWidth, canvasHeight));
    }
    for (let i = 0; i < 5; i++) {
      this.enemies.push(new Enemy(enemyOneImage, canvasWidth, canvasHeight));
    }
  }
}
