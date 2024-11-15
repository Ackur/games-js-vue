export const useContentUI = (game) => {
  const fontSize = 30;
  const fontFamily = "Helvetica";

  function draw() {
    game.ctx.font = `${fontSize}px ${fontFamily}`;
    game.ctx.textAlign = "left";
    game.ctx.fillStyle = game.fontColor;

    //score
    game.ctx.fillText(`Score: ${game.score}`, 20, 40);
  }

  return { draw };
};
