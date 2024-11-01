class GameAudio {
  constructor(src) {
    this.sound = new Audio(src);
  }

  play() {
    this.sound.pause();
    this.sound.currentTime = 0;
    this.sound.play();
  }
}

export const useSounds = () => {
  const sounds = {
    pageturn: {
      instance: new GameAudio("/audio/pageturn-102978.mp3"),
      play: () => sounds.pageturn.instance.play(),
    },
    flipcard: {
      instance: new GameAudio("/audio/flipcard-91468.mp3"),
      play: () => sounds.flipcard.instance.play(),
    },
    tada: {
      instance: new GameAudio("/audio/level-up-bonus-sequence-1-186890.mp3"),
      play: () => sounds.tada.instance.play(),
    },
    kick: {
      instance: new GameAudio("/audio/kick-v1.aac"),
      play: () => sounds.kick.instance.play(),
    },
    kick2: {
      instance: new GameAudio("/audio/kick-v2.aac"),
      play: () => sounds.kick2.instance.play(),
    },
    kick3: {
      instance: new GameAudio("/audio/kick-tenis-ball.aac"),
      play: () => sounds.kick3.instance.play(),
    },
    ballOut: {
      instance: new GameAudio("/audio/game-over-arcade.mp3"),
      play: () => sounds.ballOut.instance.play(),
    },
    gameOver: {
      instance: new GameAudio("/audio/failure.mp3"),
      play: () => sounds.gameOver.instance.play(),
    },
    gameWin: {
      instance: new GameAudio("/audio/success-fanfare.mp3"),
      play: () => sounds.gameWin.instance.play(),
    },
  };

  return { sounds };
};
