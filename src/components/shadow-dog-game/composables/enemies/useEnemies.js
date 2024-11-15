import { ClimbingEnemy, FlyingEnemy, GroundEnemy } from "./components/Enemy";

export const useEnemies = (game) => {
  let enemies = [];
  let enemyTimer = 0;
  const enemyInterval = 1000;

  function update(deltaTime) {
    if (enemyTimer > enemyInterval) {
      addEnemy();
      enemyTimer = 0;
    } else {
      enemyTimer += deltaTime;
    }
    enemies.forEach((enemy, index) => {
      enemy.update(deltaTime);
      if (enemy.markedForDeletion) {
        enemies.splice(index, 1);
      }
    });
  }

  function draw() {
    enemies.forEach((enemy) => enemy.draw());
  }

  function addEnemy() {
    if (game.speed > 0 && Math.random() < 0.2) {
      enemies.push(new GroundEnemy(game));
    } else if (game.speed > 0 && Math.random() < 0.2) {
      enemies.push(new ClimbingEnemy(game));
    }
    enemies.push(new FlyingEnemy(game));
  }

  return { enemies, update, draw };
};
