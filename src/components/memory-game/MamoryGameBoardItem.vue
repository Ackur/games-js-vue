<template>
  <div
    class="memory-game__board--item"
    :class="[{ selected: item.selected, matched: item.matched }]"
  >
    <div class="item-backface">II</div>
    <div class="item-frontface">
      {{ props.item.value }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ item: Object });
</script>

<style lang="scss" scoped>
.memory-game__board--item {
  position: relative;
  width: 150px;
  height: 150px;
  outline: 3px solid transparent;
  user-select: none;
  cursor: pointer;

  transform-style: preserve-3d;
  transform: perspective(9cm) rotateY(180deg);
  transition: 0.5s;

  &.selected,
  &.matched {
    transform: perspective(9cm) rotateY(0deg);
  }

  &.matched {
    animation: shadow 1s 0.3s ease-in-out alternate forwards;
    overflow: hidden;

    @keyframes shadow {
      0% {
        box-shadow: 0 0 0px 0px yellowgreen;
      }
      50% {
        box-shadow: 0 0 20px 7px yellowgreen;
        outline-color: transparent;
      }
      100% {
        box-shadow: 0 0 0px 0px yellowgreen;
        outline-color: yellowgreen;
        border-radius: 6px;
      }
    }
  }

  .item-backface {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 90px;
    color: #0b614d;
    background-color: #044d3c;
  }
  .item-frontface {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #229b7f;
    font-size: 90px;
    backface-visibility: hidden;
  }
}
</style>
