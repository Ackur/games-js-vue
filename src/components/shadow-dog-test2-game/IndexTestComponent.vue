<template>
  <div class="shadow-game">
    <button
      class="shadow-game__fullscreen-button"
      @click="onClickFullscreenToogle"
    >
      Fullscreen Toogle
    </button>
    <canvas
      :ref="(el) => (refs.canvas = el)"
      class="shadow-game__canvas"
      @click="onClickCanvas"
    ></canvas>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { GameTestEnemies } from "./components/GameTestEnemies";
import {
  Player,
  Background,
  Enemy,
} from "./components/GameTestWithSideScroller";

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

let gameTestEnemies = null;
let gamePlayer = null;
let gameBackground = null;

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
  gameTestEnemies = new GameTestEnemies(ctx);
  gamePlayer = new Player(ctx);
  gameBackground = new Background(ctx);
  enemies.push(new Enemy(ctx));

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
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  if (!gameOver) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // gameTestEnemies.update(deltaTime);
    // gameTestEnemies.draw();

    gameBackground.update(deltaTime);
    gameBackground.draw();

    updateEnemies(deltaTime);

    gamePlayer.update(deltaTime);
    gamePlayer.draw();
  } else {
    const pressedKeys = gamePlayer.inputs.keys;
    if (pressedKeys.includes("Enter") || pressedKeys.includes("swipe down")) {
      restartGame();
    }
  }

  drawScore();

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
  gameBackground.restart();

  gameOver = false;
  gameScore = 0;
  enemies = [];
}

function onClickCanvas(evt) {
  const posotionX = evt.x - canvasPosition.left;
  const posotionY = evt.y - canvasPosition.top;
  const detectPixelColor = ctx.getImageData(posotionX, posotionY, 1, 1);
  const [pixelR, pixelG, pixelB] = detectPixelColor.data;
}
function onClickFullscreenToogle() {
  if (!document.fullscreenElement) {
    refs.canvas.requestFullscreen().catch((err) => console.log(err));
  } else {
    document.exitFullscreen();
  }
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
    background: black;
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
