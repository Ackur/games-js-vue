<template>
  <div class="shadow-game">
    <canvas
      :ref="(el) => (refs.canvas = el)"
      class="shadow-game__canvas"
      @click="onClickCanvas"
    ></canvas>

    <div>
      <select @change="onPlayerSateChange">
        <option
          v-for="item in player.animationsStates"
          :key="item.name"
          :value="item.name"
          :selected="player.state === item.name"
        >
          {{ item.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
import { Player } from "./components/PlayerDog";
import { GameLayers } from "./components/GameLayers";
import { GameEnemies } from "./components/Enemies";

const refs = reactive({});

const sounds = {
  boom: { play: () => new Audio("/audio/shoot/SHOOT005.mp3").play() },
};

/** @type {HTMLCanvasElement} */
let ctx = null;
let canvasPosition = null;
const canvasWidth = 800;
const canvasHeight = 700;
const gameSpeed = 10;
let gameScore = 0;

const player = new Player();
const gameLayers = new GameLayers(gameSpeed);
const gameEnemies = new GameEnemies(canvasWidth, canvasHeight);
let lastTime = 0;

function init() {
  ctx = refs.canvas.getContext("2d");
  refs.canvas.width = canvasWidth;
  refs.canvas.height = canvasHeight;

  canvasPosition = refs.canvas.getBoundingClientRect();

  animate(0);
}

function animate(timestamp) {
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  gameLayers.update(ctx);
  player.update(ctx);
  gameEnemies.update(ctx);

  window.requestAnimationFrame(animate);
}

function drawScore() {
  ctx.font = "bold 30px monospace";
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + gameScore, 35, 50);
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + gameScore, 33, 47);
}

function onPlayerSateChange({ target }) {
  player.state = target.value;
}

function onClickCanvas(evt) {
  const posotionX = evt.x - canvasPosition.left;
  const posotionY = evt.y - canvasPosition.top;
  const detectPixelColor = ctx.getImageData(posotionX, posotionY, 1, 1);
  const [pixelR, pixelG, pixelB] = detectPixelColor.data;
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
  }
}
</style>
