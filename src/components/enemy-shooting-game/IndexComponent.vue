<template>
  <div class="shadow-game">
    <canvas
      :ref="(el) => (refs.canvas = el)"
      class="shadow-game__canvas"
    ></canvas>
    <canvas
      :ref="(el) => (refs.canvasCollision = el)"
      class="shadow-game__canvas collision"
      @click="onClickCanvas"
    ></canvas>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { Explosion } from "./components/Explosion";
import { Raven } from "./components/Raven";

const refs = reactive({});

const sounds = {
  boom: { play: () => new Audio("./audio/shoot/SHOOT005.mp3").play() }
};

/** @type {HTMLCanvasElement} */
let ctx = null;
let ctxCollision = null;
let canvasPosition = null;
const canvasWidth = 800;
const canvasHeight = 700;
let gameScore = 0;

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;
let revens = [];
let explosions = [];

function init() {
  ctx = refs.canvas.getContext("2d");
  refs.canvas.width = canvasWidth;
  refs.canvas.height = canvasHeight;
  ctxCollision = refs.canvasCollision.getContext("2d");
  refs.canvasCollision.width = canvasWidth;
  refs.canvasCollision.height = canvasHeight;

  canvasPosition = refs.canvas.getBoundingClientRect();

  animate(0);
}

function animate(timestamp) {
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctxCollision.clearRect(0, 0, canvasWidth, canvasHeight);

  timeToNextRaven += deltaTime;
  if (timeToNextRaven > ravenInterval) {
    revens.push(new Raven(canvasWidth, canvasHeight));
    timeToNextRaven = 0;
    revens.sort((a, b) => a.width - b.width);
  }
  [...explosions, ...revens].forEach((el) =>
    el.update(ctx, ctxCollision, deltaTime)
  );
  revens = revens.filter((el) => !el.markedForDeletion);
  explosions = explosions.filter((el) => !el.markedForDeletion);
  drawScore();

  window.requestAnimationFrame(animate);
}

function drawScore() {
  ctx.font = "bold 30px monospace";
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + gameScore, 35, 50);
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + gameScore, 33, 47);
}

function createExplosionAnimation(x, y, width) {
  explosions.push(new Explosion(x, y, width));
}

function onClickCanvas(evt) {
  const posotionX = evt.x - canvasPosition.left;
  const posotionY = evt.y - canvasPosition.top;
  const detectPixelColor = ctxCollision.getImageData(
    posotionX,
    posotionY,
    1,
    1
  );
  const [pixelR, pixelG, pixelB] = detectPixelColor.data;
  revens.forEach((el) => {
    if (
      el.color.r === pixelR &&
      el.color.g === pixelG &&
      el.color.b === pixelB
    ) {
      el.markedForDeletion = true;
      createExplosionAnimation(posotionX, posotionY, el.width);
      gameScore++;
    }
  });
  sounds.boom.play();
}
onMounted(init);
</script>

<style lang="scss" scoped>
.shadow-game {
  & &__canvas {
    position: absolute;
    inset: 0;
    border: 1px solid;
    margin: auto;
    background: #ddd;
    cursor:
      url("/images/shoot.svg") 32 32,
      auto;

    &:active {
      cursor:
        url("/images/shoot-small.svg") 24 24,
        auto;
    }

    &.collision {
      background: transparent;
      opacity: 0;
    }
  }
}
</style>
