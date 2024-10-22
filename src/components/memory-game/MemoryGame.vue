<template>
  <div class="memory-game">
    <div class="memory-game__container">
      <div class="memory-game__header">
        <span>{{ countOfMoves }}</span>
        <span> best score: {{ bestScore }}</span>
      </div>
      <h1 class="memory-game--title">memory game</h1>

      <div class="memory-game__board" @click="onClickBoard">
        <MamoryGameBoardItem
          v-for="(item, index) in items"
          :key="index"
          :data-item-index="index"
          :item="item"
        >
          {{ item.value }}
        </MamoryGameBoardItem>
      </div>

      <nav class="memory-game__menu">
        <button class="memory-game__menu--item reset" @click="reset">
          reset game
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

import MamoryGameBoardItem from "./MamoryGameBoardItem.vue";

const audio = {
  pageturn: {
    play: () => new Audio("/audio/pageturn-102978.mp3").play(),
  },
  flipcard: {
    play: () => new Audio("/audio/flipcard-91468.mp3").play(),
  },
  tada: {
    play: () => new Audio("/audio/level-up-bonus-sequence-1-186890.mp3").play(),
  },
};

const items = ref([
  {
    value: "🍇",
    selected: false,
    matched: false,
  },
  {
    value: "🍇",
    selected: false,
    matched: false,
  },
  {
    value: "🍈",
    selected: false,
    matched: false,
  },
  {
    value: "🍈",
    selected: false,
    matched: false,
  },
  {
    value: "🍉",
    selected: false,
    matched: false,
  },
  {
    value: "🍉",
    selected: false,
    matched: false,
  },
  {
    value: "🍊",
    selected: false,
    matched: false,
  },
  {
    value: "🍊",
    selected: false,
    matched: false,
  },
  {
    value: "🍋‍🟩",
    selected: false,
    matched: false,
  },
  {
    value: "🍋‍🟩",
    selected: false,
    matched: false,
  },
  {
    value: "🍌",
    selected: false,
    matched: false,
  },
  {
    value: "🍌",
    selected: false,
    matched: false,
  },
  {
    value: "🍍",
    selected: false,
    matched: false,
  },
  {
    value: "🍍",
    selected: false,
    matched: false,
  },
  {
    value: "🍋",
    selected: false,
    matched: false,
  },
  {
    value: "🍋",
    selected: false,
    matched: false,
  },
]);

const selectedState = ref([]);
const countOfMoves = ref(0);
const bestScore = ref(0);

function onClickBoard(evt) {
  const gameItemIndex =
    evt.target.closest("[data-item-index]")?.dataset?.itemIndex;
  if (gameItemIndex === undefined) return;
  if (selectedState.value.length > 1) return;

  const selectedItem = items.value[gameItemIndex];

  if (!selectedItem || selectedItem.selected || selectedItem.matched) return;

  selectedItem.selected = true;
  selectedState.value.push(selectedItem);
  audio.pageturn.play();

  if (selectedState.value.length < 2) return;

  const isMatched = selectedState.value.every(
    (item) => item.value === selectedItem.value
  );

  setTimeout(
    () => {
      countOfMoves.value++;
      selectedState.value.forEach((item) => {
        item.selected = false;
        item.matched = isMatched;
      });
      selectedState.value = [];

      if (isMatched) {
        audio.tada.play();
      } else {
        audio.flipcard.play();
      }

      const gameIsOver = items.value.every((item) => item.matched);
      if (gameIsOver) {
        if (!bestScore.value || countOfMoves.value < bestScore.value) {
          bestScore.value = countOfMoves.value;
        }
      }
    },
    isMatched ? 0 : 700
  );
}

function reset() {
  selectedState.value = [];
  countOfMoves.value = 0;
  items.value = items.value.map((item) => {
    item.selected = item.matched = false;
    return item;
  });

  setTimeout(() => items.value.sort(() => (Math.random() > 0.5 ? 2 : -1)), 500);
}

reset();
</script>

<style lang="scss">
.memory-game {
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #093a2f;

  &__container {
    max-width: 800px;
    width: 100%;
    background-color: #0d614e;
    padding: 40px 60px;
  }

  &--title {
    color: wheat;
    font-size: 42px;
    text-transform: uppercase;
    text-align: center;
    margin-bottom: 16px;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: wheat;
  }

  &__board {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 20px;
  }

  &__menu {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 30px;

    &--item {
      &.reset {
        height: 50px;
        font-size: 22px;
        text-transform: uppercase;
        color: #336b69;
        background-color: #cccdcd;
        padding: 8px 16px;
      }
    }
  }
}
</style>
