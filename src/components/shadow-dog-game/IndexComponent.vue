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
import { useGame } from "./composables/useGame";

const refs = reactive({});

const sounds = {
  boom: { play: () => new Audio("/audio/shoot/SHOOT005.mp3").play() }
};

/** @type {HTMLCanvasElement} */
let ctx = null;
let canvasPosition = null;
const canvasWidth = 1000;
const canvasHeight = 500;

let lastFrameTime = document.timeline.currentTime;
let game = null;

function init() {
  /** @type {HTMLCanvasElement} */
  ctx = refs.canvas.getContext("2d");
  refs.canvas.width = canvasWidth;
  refs.canvas.height = canvasHeight;

  canvasPosition = refs.canvas.getBoundingClientRect();

  game = useGame(ctx);

  animate();
}

function animate(timestamp = document.timeline.currentTime) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  let deltaTime = timestamp - lastFrameTime;
  lastFrameTime = timestamp;

  game.update(deltaTime);
  game.draw();

  if (!game.gameOver.value) window.requestAnimationFrame(animate);
}

onMounted(init);
</script>

<style lang="scss" scoped>
@font-face {
  font-family: "Creepster";
  src: url(/fonts/Creepster/Creepster-Regular.ttf) format("truetype");
  font-weight: 400;
  font-display: swap;
}
.shadow-game {
  & &__canvas {
    position: absolute;
    inset: 0;
    max-width: 100svw;
    max-height: 100svh;
    background: white;
    margin: auto;
  }
}
</style>
