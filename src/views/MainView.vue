<template>
  <div class="main-view">
    <button class="button-back" @click="onClickBack">
      <img
        v-if="selectedGame.component"
        src="/images/icons/back-arrow-icon.svg"
        width="40"
        alt="back arrow"
      />
    </button>

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

function onClickBack() {
  selectedGame.value = {};
}
</script>

<style lang="scss">
.main-view {
  min-height: 100svh;
  position: relative;
  background-color: #9b1d1d;

  .game-list {
    min-height: 100svh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  .button-back {
    position: absolute;
    top: 10px;
    left: 20px;
    background: transparent;
    transition: 0.35s;
    filter: drop-shadow(2px 2px 0px white);
    user-select: none;
    z-index: 1;

    &:hover {
      filter: drop-shadow(2px 2px 0px white) drop-shadow(2px 2px 4px black);
    }
  }
}
</style>
