<template>
  <div class="main-view">
    <!-- <MemoryGame></MemoryGame> -->
    <ul v-if="!selectedGame.component" class="game-list">
      <li
        v-for="(game, key) in gameList"
        :key="key"
        class="game-list--item"
        @click="onClickGame(game)"
      >
        {{ game.name }}
      </li>
    </ul>
    <component :is="selectedGame.component" />
  </div>
</template>

<script setup>
import { shallowRef } from "vue";
import MemoryGame from "../components/memory-game/MemoryGame.vue";
import BreakoutGame from "../components/breakout-game/IndexComponent.vue";

const gameList = {
  memoryGame: {
    name: "Memory Game",
    component: MemoryGame,
  },
  breakoutGame: {
    name: "Breakout Game",
    component: BreakoutGame,
  },
};

const selectedGame = shallowRef({});

function onClickGame(game) {
  selectedGame.value = game;
}
</script>

<style lang="scss">
.main-view {
  min-height: 100svh;

  .game-list {
    &--item {
      font-size: 22px;
      color: blue;
      font-weight: 600;
      cursor: pointer;

      &:hover {
        color: blueviolet;
      }
    }
  }
}
</style>
