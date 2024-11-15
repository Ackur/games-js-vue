export function drawStatusText(context, inputs, player) {
  context.font = "20px Helvetica";
  context.fillText("Last input: " + inputs.lastKey, 20, 30);
  context.fillText("Active state: " + player.currentState.state, 20, 60);
}
