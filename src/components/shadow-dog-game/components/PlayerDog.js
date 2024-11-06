import playerSprite from "/images/shadow-dog/shadow_dog.png";

export class Player {
  gameFrame = 0;
  staggerFrames = 5;

  image = new Image();
  state = "run";
  sprite = { width: 575, height: 523, animations: {} };
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

  constructor() {
    this.init();
  }

  init() {
    this.image.src = playerSprite;
    this.image.onerror = (error) => console.log("ERROR Image", error);

    this.animationsStates.forEach((state, index) => {
      let frames = { loc: [] };
      for (let j = 0; j < state.frames; j++) {
        let positionX = j * this.sprite.width;
        let positionY = index * this.sprite.height;
        frames.loc.push({ x: positionX, y: positionY });
      }
      this.sprite.animations[state.name] = frames;
    });
  }

  update(ctx) {
    let position =
      Math.floor(this.gameFrame / this.staggerFrames) %
      this.sprite.animations[this.state].loc.length;

    const frameX = this.sprite.width * position;
    const frameY = this.sprite.animations[this.state].loc[position].y;

    ctx.drawImage(
      this.image,
      frameX,
      frameY,
      this.sprite.width,
      this.sprite.height,
      0,
      0,
      this.sprite.width,
      this.sprite.height
    );

    this.gameFrame++;
  }
}
