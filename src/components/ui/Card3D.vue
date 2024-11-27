<template>
  <div
    :ref="(el) => (refs.card = el)"
    class="card-3d"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <div :ref="(el) => (refs.cardContent = el)" class="card-3d__content">
      <div :ref="(el) => (refs.cardGloss = el)" class="card-3d__gloss"></div>
      <span class="card-3d--name">click to play</span>
      <img
        :ref="(el) => (refs.cardImage = el)"
        :src="props.image || './images/icons/game-icon.svg'"
        class="card-3d--image"
        alt="card image"
      />
      <span class="card-3d--text">{{ props.name }}</span>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";

const props = defineProps({ name: String, image: String });

const refs = reactive({});

function mapNumberRange(n, a, b, c, d) {
  return ((n - a) * (d - c)) / (b - a) + c;
}

function onMouseMove(e) {
  const pointerX = e.clientX;
  const pointerY = e.clientY;

  const cardRect = refs.card.getBoundingClientRect();

  const halfWidth = cardRect.width / 2;
  const halfHeight = cardRect.height / 2;

  const cardCenterX = cardRect.left + halfWidth;
  const cardCenterY = cardRect.top + halfHeight;

  const deltaX = pointerX - cardCenterX;
  const deltaY = pointerY - cardCenterY;

  const distanceToCenter = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  const maxDistance = Math.max(halfWidth, halfHeight);

  const degree = mapNumberRange(distanceToCenter, 0, maxDistance, 0, 10);

  const rx = mapNumberRange(deltaY, 0, halfWidth, 0, 1);
  const ry = mapNumberRange(deltaX, 0, halfHeight, 0, 1);

  refs.cardContent.style.transform = `perspective(400px) rotate3d(${-rx}, ${ry}, 0, ${degree}deg)`;

  refs.cardGloss.style.transform = `translate(${-ry * 100}%, ${
    -rx * 100
  }%) scale(2.4)`;

  refs.cardGloss.style.opacity = `${mapNumberRange(
    distanceToCenter,
    0,
    maxDistance,
    0,
    0.6
  )}`;
}

function onMouseLeave() {
  refs.cardContent.style = null;
  refs.cardGloss.style.opacity = 0;
}
</script>

<style lang="scss" scoped>
.card-3d {
  position: relative;
  max-width: 360px;
  width: 100%;
  height: 400px;
  padding: 20px;
  cursor: pointer;

  &__content {
    position: relative;
    width: 100%;
    height: 100%;
    background: rgba($color: #000000, $alpha: 0.1);
    border-radius: 20px;
    will-change: transform;
    transition: transform 0.25s ease-out;
    box-shadow:
      0 20px 25px -5px rgb(0 0 0 / 0.1),
      0 8px 10px -6px rgb(0 0 0 / 0.1);
    overflow: hidden;
  }

  &__gloss {
    opacity: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 1) 0%,
      rgba(255, 255, 255, 0) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    will-change: opacity;
    transition: 0.25s opacity ease-out;
  }

  & &--name {
    position: absolute;
    top: 0;
    left: 0;
    text-align: center;
    width: 100%;
    color: #fff;
    opacity: 0;
    z-index: 10;
    transition: 0.5s;
  }

  & &--text {
    position: absolute;
    bottom: 5px;
    left: 50%;
    color: #fff;
    background: rgba($color: #000000, $alpha: 0.1);
    backdrop-filter: blur(5px);
    padding: 10px 20px;
    border-radius: 10px;
    transition: 0.5s;
    transform: translate3d(-50%, 0, 0);
    font-size: 24px;
    font-weight: 400;
    text-transform: uppercase;
    text-align: center;
    text-wrap: nowrap;
    z-index: 10;
  }

  & &--image {
    position: absolute;
    top: 50%;
    left: 50%;
    aspect-ratio: 4 / 4;
    width: 100%;
    max-width: 80%;
    object-fit: contain;
    transform: translate3d(-50%, -50%, 0);
    transition: 0.5s;
  }

  &:hover {
    .card-3d--name {
      top: 20px;
      opacity: 1;
    }

    .card-3d--image {
      filter: drop-shadow(2px 4px 6px black);
    }

    .card-3d--text {
      text-shadow: 3px 3px 5px #000000;
    }
  }
}
</style>
