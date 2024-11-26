import { FloatingMessage } from "./components/FloatingMessage";

export const useContentUI = (game) => {
  const fontSize = 30;
  const fontFamily = "Creepster";

  const livesImage = new Image();
  livesImage.src = "/images/shadow-dog/lives.png";

  let floatingMessages = [];

  function update() {
    // floatingMessages
    floatingMessages.forEach((message) => message.update(game.ctx));
    floatingMessages = floatingMessages.filter(
      (message) => !message.markedForDeletion
    );
  }

  function draw() {
    game.ctx.save();

    game.ctx.shadowOffsetX = 2;
    game.ctx.shadowOffsetY = 2;
    game.ctx.shadowColor = "white";
    game.ctx.shadowBlur = 0;

    game.ctx.font = `${fontSize}px ${fontFamily}`;
    game.ctx.textAlign = "left";
    game.ctx.fillStyle = game.fontColor;

    //score
    game.ctx.fillText(`Score: ${game.score}`, 20, 40);

    // lives
    for (let i = 0; i < game.player.options.lives; i++) {
      game.ctx.drawImage(livesImage, 25 * i + 25, 95, 25, 25);
    }

    // floatingMessages
    floatingMessages.forEach((message) => message.draw(game.ctx));

    //enemyTimer
    game.ctx.font = `${fontSize * 0.8}px ${fontFamily}`;
    game.ctx.fillText(`Time: ${(game.time.value * 0.001).toFixed(1)}`, 20, 80);

    // game over message
    if (game.gameOver.value) {
      game.ctx.textAlign = "center";
      game.ctx.font = `${fontSize * 2}px ${fontFamily}`;
      game.ctx.fillText(`Boo-yah`, game.width * 0.5, game.height * 0.5 - 20);

      game.ctx.font = `${fontSize * 0.7}px ${fontFamily}`;
      game.ctx.fillText(
        `What are creatures of the night afraid of? YOU!!!`,
        game.width * 0.5,
        game.height * 0.5 + 20
      );
    }

    game.ctx.restore();
  }

  function addFloatingMessage(value, x, y, targetX, targetY) {
    floatingMessages.push(new FloatingMessage(value, x, y, targetX, targetY));
  }

  return { update, draw, addFloatingMessage };
};
