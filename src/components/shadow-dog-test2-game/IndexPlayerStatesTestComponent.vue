<template>
  <div class="shadow-game">
    <canvas
      :ref="(el) => (refs.canvas = el)"
      class="shadow-game__canvas"
    ></canvas>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import Player from "./components/playerStatesTest/Player";
import InputHandler from "./components/playerStatesTest/Inputs";
import { drawStatusText } from "./utils";

const refs = reactive({});

const sounds = {
  boom: { play: () => new Audio("/audio/shoot/SHOOT005.mp3").play() },
};

/** @type {HTMLCanvasElement} */
let ctx = null;
let canvasPosition = null;
const canvasWidth = 1000;
const canvasHeight = 700;
let gameOver = false;
let gameScore = 0;

let gamePlayer = null;
let inputs = new InputHandler();

let enemyTimer = 0;
let enemyInterval = 2000;
let enemies = [];

let lastTime = 0;

function init() {
  ctx = refs.canvas.getContext("2d");
  refs.canvas.width = canvasWidth;
  refs.canvas.height = canvasHeight;

  canvasPosition = refs.canvas.getBoundingClientRect();

  console.log(ctx);
  gamePlayer = new Player(ctx);

  animate(0);
}

function updateEnemies(deltaTime) {
  const randomEnemyInterval = Math.random() * enemyInterval + 500;
  if (enemyTimer > enemyInterval + randomEnemyInterval) {
    enemies.push(new Enemy(ctx));
    enemyTimer = 0;
  } else {
    enemyTimer += deltaTime;
  }
  enemies.forEach((el) => {
    el.update(deltaTime);
    el.draw();
  });

  enemies = enemies.filter((enemy) => {
    if (enemy.markedForDeletion) {
      gameScore++;
    } else {
      const dx =
        enemy.x + enemy.width / 3 - (gamePlayer.x + gamePlayer.width / 2);
      const dy =
        enemy.y + enemy.height / 2 - (gamePlayer.y + gamePlayer.height / 2);
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < enemy.width / 3 + gamePlayer.width / 3) {
        gameOver = true;
      }
    }
    return !enemy.markedForDeletion;
  });
}

function animate(timestamp) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  gamePlayer.update(inputs.lastKey);
  gamePlayer.draw(deltaTime);

  drawStatusText(ctx, inputs, gamePlayer);

  window.requestAnimationFrame(animate);
}

function drawScore() {
  ctx.textAlign = "left";
  ctx.font = "bold 30px monospace";
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + gameScore, 35, 50);
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + gameScore, 33, 47);

  if (gameOver) {
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.fillText(
      "GAME OVER, press Enter or swipe down to restart",
      canvasWidth / 2,
      200
    );
    ctx.fillStyle = "white";
    ctx.fillText(
      "GAME OVER, press Enter or swipe down to restart",
      canvasWidth / 2 + 2,
      202
    );
  }
}

function restartGame() {
  gamePlayer.restart();

  gameOver = false;
  gameScore = 0;
  enemies = [];
}

onMounted(init);
</script>

<style lang="scss" scoped>
.shadow-game {
  & &__canvas {
    position: absolute;
    inset: 0;
    max-width: 100svw;
    max-height: 100svh;
    background: white;
    margin: auto;
  }

  & &__fullscreen-button {
    position: absolute;
    top: 30px;
    right: 30px;
    padding: 10px 20px;
    z-index: 1000;
  }
}
</style>
