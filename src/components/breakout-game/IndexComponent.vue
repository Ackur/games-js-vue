<template>
  <div class="breakout-game" @click="onClickBoard">
    <div class="breakout-game__container">
      <div class="breakout-game__header">
        <span class="level-info">Level: {{ gameLevel }}</span>
        <div class="player-health">
          <div
            v-for="health in player.maxHealth"
            :key="health"
            class="player-health--item"
          >
            <span v-if="player.health >= health" class="item-present">❤️</span>
            <span v-else class="item-missing">🖤</span>
          </div>
        </div>
      </div>
      <div
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
            '--enemyHealth': enemy.health || 1,
          }"
          class="breakout-game__board--emeny"
          :class="[
            {
              destroyed: enemy.health < 1,
              'health-2': enemy.health === 2,
              'health-3': enemy.health > 2,
            },
          ]"
        >
          {{ enemy.id }}
          <span v-if="enemy.health === undefined">:(</span>
        </div>

        <div class="breakout-game__board--ball"></div>
        <div class="breakout-game__board--player"></div>
      </div>
    </div>

    <ConfettiComponent :ref="(el) => (refs.confetti = el)" />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref } from "vue";
import { useSounds } from "../../composables/useSounds";
import { useBreakoutGame } from "./composables/useBreakoutGame";
import ConfettiComponent from "../ConfettiComponent.vue";

const refs = reactive({});

const boardWidth = 900;
const boardHeight = 600;

const breakoutGame = useBreakoutGame({ boardWidth, boardHeight });
const { sounds } = useSounds();

const gameStarted = ref(false);

const gameLevel = ref(0);
const gameSpeed = ref(0);
const player = reactive({
  x: boardWidth / 2 - 150 / 2,
  y: 0,
  width: 150,
  height: 30,
  movementDirection: "",
  health: 5,
  maxHealth: 5,
});
const ball = reactive({
  x: boardWidth / 2 - 20 / 2,
  y: 30,
  width: 20,
  height: 20,
  currentDir: "topRight",
  dirs: {
    topLeft: {
      x: (prevX) => prevX - gameSpeed.value,
      y: (prevY) => prevY + gameSpeed.value,
    },
    topRight: {
      x: (prevX) => prevX + gameSpeed.value,
      y: (prevY) => prevY + gameSpeed.value,
    },
    bottomLeft: {
      x: (prevX) => prevX - gameSpeed.value,
      y: (prevY) => prevY - gameSpeed.value,
    },
    bottomRight: {
      x: (prevX) => prevX + gameSpeed.value,
      y: (prevY) => prevY - gameSpeed.value,
    },
  },
});

const enemyWidth = ref(0);
const enemyHeight = ref(0);
const enemies = ref([]);

function animation() {
  const { nextDirection, enemiesVithHealth } = checkContactWithEnemy();
  if (!enemiesVithHealth.length) {
    nextLevel();
    return;
  }

  if (nextDirection) {
    sounds.kick3.play();

    ball.currentDir = nextDirection;
  } else if (ball.x > boardWidth - ball.width) {
    sounds.kick.play();
    if (ball.currentDir === "topRight") {
      ball.currentDir = "topLeft";
    } else if (ball.currentDir === "bottomRight") {
      ball.currentDir = "bottomLeft";
    }
  } else if (ball.x <= 0) {
    sounds.kick.play();
    if (ball.currentDir === "topLeft") {
      ball.currentDir = "topRight";
    } else if (ball.currentDir === "bottomLeft") {
      ball.currentDir = "bottomRight";
    }
  }

  if (ball.y > boardHeight - ball.height) {
    sounds.kick.play();
    if (ball.currentDir === "topRight") {
      ball.currentDir = "bottomRight";
    } else if (ball.currentDir === "topLeft") {
      ball.currentDir = "bottomLeft";
    }
  } else if (
    ball.y < player.height &&
    ball.x <= player.x + player.width &&
    ball.x + ball.width >= player.x
  ) {
    sounds.kick.play();
    if (ball.currentDir === "bottomRight") {
      ball.currentDir =
        player.movementDirection === "left" ? "topLeft" : "topRight";
    } else if (ball.currentDir === "bottomLeft") {
      ball.currentDir =
        player.movementDirection === "right" ? "topRight" : "topLeft";
    }
  } else if (ball.y < 10) {
    player.health--;
    if (player.health < 1) {
      gameOver();
      return;
    } else {
      sounds.ballOut.play();
      stopGame();
      return;
    }
  }

  ball.x = ball.dirs[ball.currentDir].x(ball.x);

  ball.y = ball.dirs[ball.currentDir].y(ball.y);

  if (gameStarted.value) requestAnimationFrame(animation);
}

function checkContactWithEnemy() {
  const enemiesVithHealth = enemies.value.filter((el) => el.health);

  const enemy = enemiesVithHealth.find((el) => {
    if (ball.y + ball.height >= el.y && ball.y <= el.y + enemyHeight.value) {
      if (ball.x + ball.width >= el.x && ball.x <= el.x + enemyWidth.value) {
        return el;
      }
    }
  });

  let nextDirection = "";

  if (enemy) {
    enemy.health--;
    nextDirection = Object.entries({
      right: {
        // check right contact side
        value:
          ball.x - gameSpeed.value <= enemy.x + enemyWidth.value &&
          ball.x + gameSpeed.value >= enemy.x + enemyWidth.value,
        // if this contact side true then take this nextDir
        nextDir: ball.currentDir === "topLeft" ? "topRight" : "bottomRight",
      },
      left: {
        value:
          ball.x + ball.width - gameSpeed.value <= enemy.x &&
          ball.x + ball.width + gameSpeed.value >= enemy.x,
        nextDir: ball.currentDir === "topRight" ? "topLeft" : "bottomLeft",
      },
      top: {
        value:
          ball.y - gameSpeed.value <= enemy.y + enemyHeight.value &&
          ball.y + gameSpeed.value >= enemy.y + enemyHeight.value,
        nextDir: ball.currentDir === "bottomLeft" ? "topLeft" : "topRight",
      },
      bottom: {
        value:
          ball.y + ball.height - gameSpeed.value <= enemy.y &&
          ball.y + ball.height + gameSpeed.value >= enemy.y,
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
  }

  return { enemy, enemiesVithHealth, nextDirection };
}

function onMouseMove(evt) {
  player.x += evt.movementX;
  player.movementDirection =
    evt.movementX >= 4 ? "right" : evt.movementX <= -4 ? "left" : "";

  if (player.x < 0) {
    player.x = 0;
  }
  if (player.x > boardWidth - player.width) {
    player.x = boardWidth - player.width;
  }
  if (!gameStarted.value) {
    ball.x = player.x + player.width / 2 - ball.width / 2;
  }
}

function onClickBoard() {
  if (!gameStarted.value) {
    gameStarted.value = true;
    animation();
  }
}

function startGame() {
  const game = breakoutGame.start();
  enemyHeight.value = game.enemies.enemyHeight;
  enemyWidth.value = game.enemies.enemyWidth;
  enemies.value = game.enemies.items;
  gameSpeed.value = game.gameSpeed;
  gameLevel.value = game.level;
  player.health = player.maxHealth;
  document.removeEventListener("mousemove", onMouseMove);
  document.addEventListener("mousemove", onMouseMove);
}

function stopGame() {
  gameStarted.value = false;
  player.x = boardWidth / 2 - player.width / 2;
  ball.x = boardWidth / 2 - ball.width / 2;
  ball.y = 30;
  ball.currentDir = "topRight";
}

function nextLevel() {
  stopGame();
  const game = breakoutGame.nextLevel();
  if (!game) {
    sounds.gameWin.play();
    refs.confetti?.piu();
    setTimeout(() => {
      alert("GAME WON!!!");
      startGame();
    }, 100);
    return;
  }

  enemyHeight.value = game.enemies.enemyHeight;
  enemyWidth.value = game.enemies.enemyWidth;
  enemies.value = game.enemies.items;
  gameSpeed.value = game.gameSpeed;
  gameLevel.value = game.level;
}

function gameOver() {
  sounds.gameOver.play();
  setTimeout(() => {
    alert("GAME OVER");
    stopGame();
    startGame();
  }, 100);
}

function reset() {
  enemies.value.forEach((el) => {
    el.health = 1;
  });
  stopGame();
}

onMounted(() => {
  startGame();
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

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .level-info {
      color: #daa520;
      font-weight: bold;
    }

    .player-health {
      display: flex;
      align-items: center;
      padding: 4px 0;

      .item-present {
        filter: drop-shadow(0px 0px 1px #950000);
      }
    }
  }

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
      background: radial-gradient(
        farthest-corner at 13px 5px,
        #ddd 0%,
        #ff0000 50%
      );
    }

    &--player {
      position: absolute;
      bottom: var(--playerY);
      left: var(--playerX);
      width: var(--playerWidth);
      height: var(--playerHeight);
      background-color: #daa520;
      box-shadow: inset -2px -2px 4px 0px #9e9e9e, inset 2px 2px 4px 0px #9e9e9e;
    }

    &--emeny {
      position: absolute;
      bottom: var(--enemyY);
      left: var(--enemyX);
      width: var(--enemyWidth);
      height: var(--enemyHeight);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9c9c9c;
      background: #c9c9c9;
      box-shadow: 2px 2px 4px 0px #a9a9a9;

      &.health-2 {
        border: 2px dotted #a9a9a9;
      }
      &.health-3 {
        border: 2px dashed #a9a9a9;
      }
      &.destroyed {
        visibility: hidden;
        opacity: 0;
      }
    }
  }
}
</style>
