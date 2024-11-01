import { ref } from "vue";

const enemySchemas = {
  test: JSON.parse(`[
          0, 0, 0, 0, 0, 0, 1
        ]`),
  one: JSON.parse(`[
          3, 3, 3, 3, 3, 3, 3,
          3, 0, 0, 0, 0, 0, 0,
          3, 0, 0, 0, 0, 0, 0,
          3, 0, 0, 0, 0, 0, 0,
          3, 3, 3, 3, 3, 3, 0
        ]`),
  two: JSON.parse(`[
          1, 1, 1, 1, 1, 1, 1,
          1, 0, 1, 0, 1, 0, 1,
          0, 1, 0, 1, 0, 1, 0,
          0, 0, 2, 0, 2, 0, 0,
          0, 0, 0, 3, 0, 0, 0
        ]`),
  three: JSON.parse(`[
            1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1
          ]`),
  four: JSON.parse(`[
            1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1
          ]`),
};

export const useBreakoutGame = ({ boardHeight, boardWidth }) => {
  const levelIndex = ref(0);

  const enemyPresets = {
    default: (anemySchema) => {
      const enemyGaX = 25;
      const enemyFirsRowGapX = 50;
      const enemyInRow = 7;
      const enemyWidth =
        Math.floor(
          boardWidth - enemyFirsRowGapX * 2 - (enemyInRow - 1) * enemyGaX
        ) / enemyInRow;
      const enemyHeight = 20;
      return {
        enemyWidth,
        enemyHeight,
        items: genarateEnemies({
          anemySchema,
          enemyInRow,
          enemyFirsRowGapX: 50,
          enemyWidth,
          enemyGaX,
          enemyGapY: 40,
          enemyHeight,
        }),
      };
    },
  };

  const gameLevels = [
    {
      level: 1,
      gameSpeed: 5,
      enemies: enemyPresets.default(enemySchemas.three),
    },
    {
      level: 2,
      gameSpeed: 10,
      enemies: enemyPresets.default(enemySchemas.two),
    },
    {
      level: 3,
      gameSpeed: 10,
      enemies: enemyPresets.default(enemySchemas.one),
    },
  ];

  function genarateEnemies({
    anemySchema,
    anemyCount,
    enemyInRow,
    enemyFirsRowGapX,
    enemyWidth,
    enemyGaX,
    enemyGapY,
    enemyHeight,
  }) {
    let prevItemX;
    const items = Array.isArray(anemySchema)
      ? anemySchema
      : new Array(anemyCount).fill(1);
    return items.reduce((acc, health, index) => {
      const eX =
        index % enemyInRow === 0
          ? enemyFirsRowGapX
          : prevItemX + enemyWidth + enemyGaX;
      prevItemX = eX;
      if (!health) return acc;
      const rowCount = Math.floor(index / enemyInRow) + 1;
      const eY = boardHeight - enemyHeight - enemyGapY * rowCount;
      acc.push({ id: index + 1, x: eX, y: eY, health });
      return acc;
    }, []);
  }

  function nextLevel() {
    try {
      levelIndex.value++;
      const nextGameData = gameLevels.at(levelIndex.value);

      if (!nextGameData) return;

      const levelData = JSON.parse(JSON.stringify(nextGameData));

      return levelData;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  function start() {
    levelIndex.value = 0;
    return JSON.parse(JSON.stringify(gameLevels.at(levelIndex.value)));
  }

  return {
    start,
    nextLevel,
  };
};
