import { ref } from "vue";

export const useBreakoutGame = ({ boardHeight, boardWidth }) => {
  const levelIndex = ref(0);
  const gameLevels = [
    {
      level: 1,
      gameSpeed: 5,
      enemies: (() => {
        const enemyGaX = 25;
        const enemyFirsRowGapX = 50;
        const enemyInRow = 7;
        const enemyWidth = Math.floor(
          (boardWidth - enemyFirsRowGapX * 2 - (enemyInRow - 1) * enemyGaX) /
            enemyInRow
        );
        const enemyHeight = 20;
        return {
          enemyWidth,
          enemyHeight,
          items: genarateEnemies({
            anemyCount: 28,
            enemyInRow,
            enemyFirsRowGapX: 50,
            enemyWidth,
            enemyGaX,
            enemyGapY: 40,
            enemyHeight,
          }),
        };
      })(),
    },
    {
      level: 2,
      gameSpeed: 10,
      enemies: (() => {
        const enemyGaX = 25;
        const enemyFirsRowGapX = 50;
        const enemyInRow = 7;
        const enemyWidth = Math.floor(
          (boardWidth - enemyFirsRowGapX * 2 - (enemyInRow - 1) * enemyGaX) /
            enemyInRow
        );
        const enemyHeight = 20;
        return {
          enemyWidth,
          enemyHeight,
          items: genarateEnemies({
            anemyCount: 28,
            enemyInRow,
            enemyFirsRowGapX: 50,
            enemyWidth,
            enemyGaX,
            enemyGapY: 40,
            enemyHeight,
          }),
        };
      })(),
    },
  ];

  function genarateEnemies({
    anemyCount,
    enemyInRow,
    enemyFirsRowGapX,
    enemyWidth,
    enemyGaX,
    enemyGapY,
    enemyHeight,
  }) {
    let prevItemX;
    return new Array(anemyCount)
      .fill({ id: 1, x: 0, y: 0, health: 1 })
      .map((_, index) => {
        const eX =
          index % enemyInRow === 0
            ? enemyFirsRowGapX
            : prevItemX + enemyWidth + enemyGaX;
        prevItemX = eX;
        const rowCount = Math.floor(index / enemyInRow) + 1;
        const eY = boardHeight - enemyHeight - enemyGapY * rowCount;
        return { id: index + 1, x: eX, y: eY, health: 1 };
      });
  }

  function nextLevel() {
    levelIndex.value++;
    return gameLevels.at(levelIndex.value);
  }

  return {
    start: () => gameLevels.at(levelIndex.value),
    nextLevel,
  };
};
