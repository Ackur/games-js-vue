import {
  ClimbingEnemy,
  EnemyCollisionAnimation,
  FlyingEnemy,
  GroundEnemy
} from "./components/Enemy";

export const useEnemies = (game) => {
  let enemies = [];
  let collisions = [];
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
    collisions.forEach((collision) => {
      collision.update(deltaTime);
    });
  }

  function draw() {
    enemies.forEach((enemy) => enemy.draw());
    collisions.forEach((collision) => collision.draw());
  }

  function addEnemy() {
    if (game.speed > 0 && Math.random() < 0.2) {
      enemies.push(new GroundEnemy(game));
    } else if (game.speed > 0 && Math.random() < 0.2) {
      enemies.push(new ClimbingEnemy(game));
    }
    enemies.push(new FlyingEnemy(game));
  }

  function addCollisionAnimation(x, y) {
    collisions.push(new EnemyCollisionAnimation(game, x, y));
  }

  return { enemies, update, draw, addCollisionAnimation };
};
