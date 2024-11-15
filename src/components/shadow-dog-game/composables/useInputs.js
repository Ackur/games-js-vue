import { reactive, watch } from "vue";

export const useInputs = (game) => {
  const keys = reactive([]);
  const keysNames = {
    Space: ["Space", "Enter", "ControlLeft"],
    ArrowDown: ["ArrowDown", "KeyS"],
    ArrowUp: ["ArrowUp", "KeyW"],
    ArrowLeft: ["ArrowLeft", "KeyA"],
    ArrowRight: ["ArrowRight", "KeyD"],
  };
  let touchY = 0;
  const touchThreshold = 30;

  function isPresentInKeysNames(keyCode) {
    return Object.values(keysNames).some((value) => value.includes(keyCode));
  }

  function isKeyNamePresetInKeys(keyName) {
    return keys.some((keyCode) => keyName.includes(keyCode));
  }

  function init() {
    window.addEventListener("keydown", (e) => {
      if (isPresentInKeysNames(e.code) && !keys.includes(e.code)) {
        keys.push(e.code);
      } else if (e.code === "Backquote") game.debug = !game.debug;
    });
    window.addEventListener("keyup", (e) => {
      if (isPresentInKeysNames(e.code) && keys.includes(e.code)) {
        keys.splice(keys.indexOf(e.code), 1);
      }
    });
    window.addEventListener("touchstart", (e) => {
      touchY = e.changedTouches[0].pageY;
    });
    window.addEventListener("touchmove", (e) => {
      const swipeDistance = e.changedTouches[0].pageY - touchY;
      console.log({ swipeDistance });

      if (swipeDistance < -touchThreshold && !keys.includes("swipe up")) {
        keys.push("swipe up");
      } else if (
        swipeDistance > touchThreshold &&
        !keys.includes("swipe down")
      ) {
        keys.push("swipe down");
      }
    });
    window.addEventListener("touchend", (e) => {
      keys.splice(keys.indexOf("swipe up"), 1);
      keys.splice(keys.indexOf("swipe down"), 1);
    });
  }

  // watch(keys, (val) => {
  //   console.log("keys", val);
  // });

  init();

  return { keys, keysNames, isPresentInKeysNames, isKeyNamePresetInKeys };
};
