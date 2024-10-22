<template>
  <div class="breakout-game">
    <div class="breakout-game__container">
      <div
        :ref="(el) => (refs.board = el)"
        :style="{
          '--boardWidth': boardWidth + 'px',
          '--boardHeight': boardHeight + 'px',
          '--ballWidth': ball.width + 'px',
          '--ballHeight': ball.height + 'px',
          '--ballX': ball.x + 'px',
          '--ballY': ball.y + 'px',
          '--playerWidth': player.width + 'px',
          '--playerHeight': player.height + 'px',
          '--playerX': player.x + 'px',
          '--playerY': player.y + 'px',
        }"
        class="breakout-game__board"
      >
        <div
          v-for="enemy in enemies"
          :key="enemy.id"
          :data-enemy-id="enemy.id"
          :style="{
            '--enemyY': enemy.y + 'px',
            '--enemyX': enemy.x + 'px',
            '--enemyWidth': enemyWidth + 'px',
            '--enemyHeight': enemyHeight + 'px',
          }"
          class="breakout-game__board--emeny"
          :class="[{ destroyed: enemy.destroyed }]"
        >
          {{ enemy.id }}
        </div>

        <div
          :ref="(el) => (refs.ball = el)"
          class="breakout-game__board--ball"
        ></div>
        <div class="breakout-game__board--player" @click="startGame"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref } from "vue";

const gameStarted = ref(false);

const boardWidth = 900;
const boardHeight = 600;

const gameSpeed = 10;
const player = reactive({
  x: boardWidth / 2 - 150 / 2,
  y: 0,
  width: 150,
  height: 30,
});
const ball = reactive({
  x: boardWidth / 2 - 20 / 2,
  y: 30,
  width: 20,
  height: 20,
  currentDir: "topRight",
  dirs: {
    topLeft: {
      x: (prevX) => prevX - gameSpeed,
      y: (prevY) => prevY + gameSpeed,
    },
    topRight: {
      x: (prevX) => prevX + gameSpeed,
      y: (prevY) => prevY + gameSpeed,
    },
    bottomLeft: {
      x: (prevX) => prevX - gameSpeed,
      y: (prevY) => prevY - gameSpeed,
    },
    bottomRight: {
      x: (prevX) => prevX + gameSpeed,
      y: (prevY) => prevY - gameSpeed,
    },
  },
});

const enemyWidth = 100;
const enemyHeight = 20;
const enemyGapY = 30;
const enemies = reactive([
  { x: 50, y: boardHeight - enemyHeight - enemyGapY, id: 1, destroyed: false },
  { x: 170, y: boardHeight - enemyHeight - enemyGapY, id: 2 },
  { x: 290, y: boardHeight - enemyHeight - enemyGapY, id: 3 },
  { x: 410, y: boardHeight - enemyHeight - enemyGapY, id: 4 },
  { x: 530, y: boardHeight - enemyHeight - enemyGapY, id: 5 },
  { x: 650, y: boardHeight - enemyHeight - enemyGapY, id: 6 },
  { x: 770, y: boardHeight - enemyHeight - enemyGapY, id: 7 },

  { x: 50, y: boardHeight - enemyHeight * 3 - enemyGapY, id: 8 },
  { x: 170, y: boardHeight - enemyHeight * 3 - enemyGapY, id: 9 },
  { x: 290, y: boardHeight - enemyHeight * 3 - enemyGapY, id: 10 },
  { x: 410, y: boardHeight - enemyHeight * 3 - enemyGapY, id: 11 },
  { x: 530, y: boardHeight - enemyHeight * 3 - enemyGapY, id: 12 },
  { x: 650, y: boardHeight - enemyHeight * 3 - enemyGapY, id: 13 },
  { x: 770, y: boardHeight - enemyHeight * 3 - enemyGapY, id: 14 },

  { x: 50, y: boardHeight - enemyHeight * 5 - enemyGapY, id: 15 },
  { x: 170, y: boardHeight - enemyHeight * 5 - enemyGapY, id: 16 },
  { x: 290, y: boardHeight - enemyHeight * 5 - enemyGapY, id: 17 },
  { x: 410, y: boardHeight - enemyHeight * 5 - enemyGapY, id: 18 },
  { x: 530, y: boardHeight - enemyHeight * 5 - enemyGapY, id: 19 },
  { x: 650, y: boardHeight - enemyHeight * 5 - enemyGapY, id: 20 },
  { x: 770, y: boardHeight - enemyHeight * 5 - enemyGapY, id: 21 },
]);
const refs = reactive({});

function animation() {
  const { nextDirection } = checkContactWithEnemy();
  if (nextDirection) {
    ball.currentDir = nextDirection;
  } else if (ball.x > boardWidth - ball.width) {
    if (ball.currentDir === "topRight") {
      ball.currentDir = "topLeft";
    } else if (ball.currentDir === "bottomRight") {
      ball.currentDir = "bottomLeft";
    }
  } else if (ball.x <= 0) {
    if (ball.currentDir === "topLeft") {
      ball.currentDir = "topRight";
    } else if (ball.currentDir === "bottomLeft") {
      ball.currentDir = "bottomRight";
    }
  }

  if (ball.y > boardHeight - ball.height) {
    if (ball.currentDir === "topRight") {
      ball.currentDir = "bottomRight";
    } else if (ball.currentDir === "topLeft") {
      ball.currentDir = "bottomLeft";
    }
  } else if (
    ball.y < player.height &&
    ball.x <= player.x + player.width &&
    ball.x >= player.x
  ) {
    if (ball.currentDir === "bottomRight") {
      ball.currentDir = "topRight";
    } else if (ball.currentDir === "bottomLeft") {
      ball.currentDir = "topLeft";
    }
  } else if (ball.y < 10) {
    return reset();
  }

  ball.x = ball.dirs[ball.currentDir].x(ball.x);

  ball.y = ball.dirs[ball.currentDir].y(ball.y);

  if (gameStarted.value) requestAnimationFrame(animation);
}

function checkContactWithEnemy() {
  const enemy = enemies
    .filter((el) => !el.destroyed)
    .find((el) => {
      if (ball.y + ball.height >= el.y && ball.y <= el.y + enemyHeight) {
        if (ball.x + ball.width >= el.x && ball.x <= el.x + enemyWidth) {
          return el;
        }
      }
    });

  let nextDirection = "";

  if (enemy) {
    enemy.destroyed = true;
    nextDirection = Object.entries({
      right: {
        // check right contact side
        value: ball.x === enemy.x + enemyWidth,
        // if this contact side true then take this nextDir
        nextDir: ball.currentDir === "topLeft" ? "topRight" : "bottomRight",
      },
      left: {
        value: ball.x + ball.width === enemy.x,
        nextDir: ball.currentDir === "topRight" ? "topLeft" : "bottomLeft",
      },
      top: {
        value: ball.y === enemy.y + enemyHeight,
        nextDir: ball.currentDir === "bottomLeft" ? "topLeft" : "topRight",
      },
      bottom: {
        value: ball.y + ball.height === enemy.y,
        nextDir: ball.currentDir === "topRight" ? "bottomRight" : "bottomLeft",
      },
    }).reduce((acc, [key, side]) => {
      if (!acc && side.value) {
        console.log({
          ...side,
          contactSide: key,
          currentDir: ball.currentDir,
        });
        acc = side.nextDir;
      }
      return acc;
    }, "");

    // ball.direction.change();
  }

  return { enemy, nextDirection };
}

function onMouseMove(evt) {
  player.x = player.x + evt.movementX;
  if (player.x < 0) {
    return (player.x = 0);
  }
  if (player.x > boardWidth - player.width) {
    return (player.x = boardWidth - player.width);
  }
}

function reset() {
  player.x = boardWidth / 2 - player.width / 2;
  ball.x = boardWidth / 2 - ball.width / 2;
  ball.y = 30;
  ball.currentDir = "topRight";
  gameStarted.value = false;
  enemies.forEach((el) => {
    el.destroyed = false;
  });
  document.removeEventListener("mousemove", onMouseMove);
}

function startGame() {
  gameStarted.value = true;
  animation();
  document.addEventListener("mousemove", onMouseMove);
}

onMounted(() => {
  // startGame();
});
onUnmounted(() => {
  reset();
});
</script>

<style lang="scss" scoped>
.breakout-game {
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: grey;

  &__board {
    position: relative;
    width: var(--boardWidth);
    height: var(--boardHeight);
    background-color: beige;
    border: 2px solid black;
    box-sizing: content-box;

    &--ball {
      position: absolute;
      bottom: var(--ballY);
      left: var(--ballX);
      width: var(--ballWidth);
      height: var(--ballHeight);
      border-radius: var(--ballWidth);
      background-color: red;
    }

    &--player {
      position: absolute;
      bottom: var(--playerY);
      left: var(--playerX);
      width: var(--playerWidth);
      height: var(--playerHeight);
      background-color: goldenrod;
    }

    &--emeny {
      position: absolute;
      bottom: var(--enemyY);
      left: var(--enemyX);
      width: var(--enemyWidth);
      height: var(--enemyHeight);
      background-color: brown;

      &.destroyed {
        visibility: hidden;
        opacity: 0;
      }
    }
  }
}
</style>
