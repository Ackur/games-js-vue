<template>
  <div class="main-view">
    <div v-if="!selectedGame.component" class="game-list">
      <Card3D
        v-for="(game, key) in gameList"
        :key="key"
        :name="game.name"
        :text="game.name"
        :image="game.image"
        @click="onClickGame(game)"
      />
    </div>
    <component :is="selectedGame.component" />
  </div>
</template>

<script setup>
import { shallowRef } from "vue";
import MemoryGame from "@/components/memory-game/MemoryGame.vue";
import BreakoutGame from "@/components/breakout-game/IndexComponent.vue";
import ShadowDog from "@/components/shadow-dog-game/IndexComponent.vue";
import EnemyShooter from "@/components/enemy-shooting-game/IndexComponent.vue";
import Card3D from "@/components/ui/Card3D.vue";

const gameList = {
  memoryGame: {
    name: "Memory Game",
    component: MemoryGame,
    image: "./images/memory-game-v2.svg"
  },
  breakoutGame: {
    name: "Breakout Game",
    component: BreakoutGame,
    image: "./images/breakout-game.webp"
  },
  EnemyShooter: {
    name: "Enemy Shooter",
    component: EnemyShooter,
    image: "./images/enemy-shooter.webp"
  },
  shadowDog: {
    name: "Shadow dog",
    component: ShadowDog,
    image: "./images/shadow-dog.webp"
  }
};

const selectedGame = shallowRef({});

function onClickGame(game) {
  selectedGame.value = game;
}
</script>

<style lang="scss">
.main-view {
  background-color: #9b1d1d;

  .game-list {
    min-height: 100svh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
