class InputHandler {
  keys = [];
  keysNames = ["Enter", "ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"];
  touchY = 0;
  touchThreshold = 30;
  constructor() {
    window.addEventListener("keydown", (e) => {
      if (this.keysNames.includes(e.key) && !this.keys.includes(e.key)) {
        this.keys.push(e.key);
      }
    });
    window.addEventListener("keyup", (e) => {
      if (this.keysNames.includes(e.key) && this.keys.includes(e.key)) {
        this.keys.splice(this.keys.indexOf(e.key), 1);
      }
    });
    window.addEventListener("touchstart", (e) => {
      this.touchY = e.changedTouches[0].pageY;
    });
    window.addEventListener("touchmove", (e) => {
      const swipeDistance = e.changedTouches[0].pageY - this.touchY;
      console.log({ swipeDistance });

      if (
        swipeDistance < -this.touchThreshold &&
        !this.keys.includes("swipe up")
      ) {
        this.keys.push("swipe up");
      } else if (
        swipeDistance > this.touchThreshold &&
        !this.keys.includes("swipe down")
      ) {
        this.keys.push("swipe down");
      }
    });
    window.addEventListener("touchend", (e) => {
      this.keys.splice(this.keys.indexOf("swipe up"), 1);
      this.keys.splice(this.keys.indexOf("swipe down"), 1);
    });
  }
}

export class Player {
  image = new Image();
  inputs = new InputHandler();
  animationsStates = [
    { name: "idle", frames: 7 },
    { name: "jump", frames: 7 },
    { name: "fall", frames: 7 },
    { name: "run", frames: 9 },
    { name: "dizzy", frames: 11 },
    { name: "sit", frames: 5 },
    { name: "roll", frames: 7 },
    { name: "bite", frames: 7 },
    { name: "ko", frames: 12 },
    { name: "getHitt", frames: 4 },
  ];

  constructor(ctx) {
    this.ctx = ctx;
    this.image.src = "/images/shadow-dog/shadow_dog.png";
    this.gameWidth = this.ctx.canvas.width;
    this.gameHeight = this.ctx.canvas.height;
    this.width = 200;
    this.height = 200;
    this.spriteWidth = 575;
    this.spriteHeight = 523;
    this.spriteState = "run";
    this.spriteAnimations = {};
    this.x = 100;
    this.y = this.gameHeight - this.height;
    this.speedX = 0;
    this.speedY = 0;
    this.weight = 1;
    this.gameFrame = 0;
    this.staggerFrames = 5;
    this.frameX = 0;
    this.frameY = 0;
    this.fps = 20;
    this.frameTimer = 0;
    this.frameInterval = 1000 / this.fps;

    this.init();
  }

  update(deltaTime) {
    let position =
      Math.floor(this.gameFrame / this.staggerFrames) %
      this.spriteAnimations[this.spriteState].loc.length;

    if (this.frameTimer > this.frameInterval) {
      this.frameX = this.spriteWidth * position;
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }

    this.frameY = this.spriteAnimations[this.spriteState].loc[position].y;

    this.x += this.speedX;
    if (this.inputs.keys.includes("ArrowRight")) {
      this.speedX = 5;
    } else if (this.inputs.keys.includes("ArrowLeft")) {
      this.speedX = -5;
    } else {
      this.speedX = 0;
    }
    if (
      (this.inputs.keys.includes("ArrowUp") ||
        this.inputs.keys.includes("swipe up")) &&
      this.isOnGRound()
    ) {
      this.speedY -= 30;
    }

    if (this.x < 0) {
      this.x = 0;
    } else if (this.x > this.gameWidth - this.width) {
      this.x = this.gameWidth - this.width;
    }

    this.y += this.speedY;

    if (!this.isOnGRound()) {
      this.speedY += this.weight;
      this.spriteState = "jump";
    } else {
      this.speedY = 0;
      this.spriteState = "run";
    }

    if (this.y >= this.gameHeight - this.height) {
      this.y = this.gameHeight - this.height;
    }
    this.gameFrame++;
  }

  draw() {
    // this.ctx.strokeStyle = "white";
    // this.ctx.beginPath();
    // this.ctx.arc(
    //   this.x + this.width / 2,
    //   this.y + this.height / 2,
    //   this.width / 3,
    //   0,
    //   Math.PI * 2
    // );
    // this.ctx.stroke();

    this.ctx.drawImage(
      this.image,
      this.frameX,
      this.frameY,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  isOnGRound() {
    return this.y >= this.gameHeight - this.height;
  }

  restart() {
    this.x = 100;
    this.y = this.gameHeight - this.height;
  }

  init() {
    this.animationsStates.forEach((state, index) => {
      let frames = { loc: [] };
      for (let j = 0; j < state.frames; j++) {
        let positionX = j * this.spriteWidth;
        let positionY = index * this.spriteHeight;
        frames.loc.push({ x: positionX, y: positionY });
      }
      this.spriteAnimations[state.name] = frames;
    });
  }
}

export class Background {
  image = new Image();

  constructor(ctx) {
    this.ctx = ctx;
    this.image.src =
      "/images/shadow-dog/backgroundLayers/background_single.png";
    this.gameWidth = this.ctx.canvas.width;
    this.gameHeight = this.ctx.canvas.height;
    this.x = 0;
    this.y = 0;
    this.width = 2400;
    this.height = 720;
    this.speed = 5;
  }

  update(deltaTime) {
    this.x -= this.speed;
    if (this.x < 0 - this.width) this.x = 0;
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    this.ctx.drawImage(
      this.image,
      this.x + this.width - this.speed,
      this.y,
      this.width,
      this.height
    );
  }

  restart() {
    this.x = 0;
  }
}

export class Enemy {
  image = new Image();

  constructor(ctx) {
    this.ctx = ctx;
    this.image.src = "/images/shadow-dog/enemies/enemy_worm.png";
    this.gameWidth = this.ctx.canvas.width;
    this.gameHeight = this.ctx.canvas.height;
    this.spriteWidth = 229;
    this.spriteHeight = 171;
    this.width = this.spriteWidth / 2;
    this.height = this.spriteHeight / 2;
    this.x = this.gameWidth;
    this.y = this.gameHeight - this.height;
    this.fps = 20;
    this.frameX = 0;
    this.maxFrame = 4;
    this.frameTimer = 0;
    this.frameInterval = 1000 / this.fps;
    this.speed = 8;
    this.markedForDeletion = false;
  }

  update(deltaTime) {
    if (this.frameTimer > this.frameInterval) {
      if (this.frameX > this.maxFrame) this.frameX = 0;
      else this.frameX++;
      this.frameTimer = 0;
    } else {
      this.frameTimer += deltaTime;
    }

    this.x -= this.speed;

    if (this.x + this.width < 0) this.markedForDeletion = true;
  }

  draw() {
    this.ctx.drawImage(
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

    // this.ctx.strokeStyle = "white";
    // this.ctx.beginPath();
    // this.ctx.arc(
    //   this.x + this.width / 3,
    //   this.y + this.height / 2,
    //   this.width / 3,
    //   0,
    //   Math.PI * 3
    // );
    // this.ctx.stroke();
  }
}
