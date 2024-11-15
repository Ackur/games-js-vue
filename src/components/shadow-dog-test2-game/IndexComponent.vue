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

const refs = reactive({});

const sounds = {
  boom: { play: () => new Audio("/audio/shoot/SHOOT005.mp3").play() },
};

/** @type {HTMLCanvasElement} */
let ctx = null;
let canvasPosition = null;
const canvasWidth = 1000;
const canvasHeight = 700;

let lastTime = 0;

function init() {
  ctx = refs.canvas.getContext("2d");
  refs.canvas.width = canvasWidth;
  refs.canvas.height = canvasHeight;

  canvasPosition = refs.canvas.getBoundingClientRect();

  console.log(ctx);

  animate(0);
}

function animate(timestamp) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  window.requestAnimationFrame(animate);
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
}
</style>
