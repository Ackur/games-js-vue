export default class InputHandler {
  keyNames = {
    ArrowLeft: "ArrowLeft",
    ArrowRight: "ArrowRight",
    ArrowDown: "ArrowDown",
    ArrowUp: "ArrowUp",
  };
  lastKey = "";

  constructor() {
    this.init();
  }

  init() {
    const { ArrowLeft, ArrowRight, ArrowDown, ArrowUp } = this.keyNames;
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case ArrowLeft:
          this.lastKey = "PRESS left";
          break;
        case ArrowRight:
          this.lastKey = "PRESS right";
          break;
        case ArrowDown:
          this.lastKey = "PRESS down";
          break;
        case ArrowUp:
          this.lastKey = "PRESS up";
          break;
      }
    });
    window.addEventListener("keyup", (e) => {
      switch (e.key) {
        case ArrowLeft:
          this.lastKey = "RELEASE left";
          break;
        case ArrowRight:
          this.lastKey = "RELEASE right";
          break;
        case ArrowDown:
          this.lastKey = "RELEASE down";
          break;
        case ArrowUp:
          this.lastKey = "RELEASE up";
          break;
      }
    });
  }
}
