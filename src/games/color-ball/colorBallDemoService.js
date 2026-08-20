const COLORS = [
  "ruby",
  "aqua",
  "violet",
  "lime",
  "gold",
];

const SIZE = 7;

const makeBoard = () =>
  Array.from({ length: SIZE }, (_, row) =>
    Array.from({ length: SIZE }, (_, col) => ({
      id: `${Date.now()}-${row}-${col}-${Math.random()}`,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))
  );

export const colorBallGameService = {
  async startGame(level = 1) {
    return {
      level,
      score: 0,
      target: 900 + (level - 1) * 250,
      moves: 22,
      board: makeBoard(),
    };
  },

  async saveProgress(state) {
    // बाद में यहाँ backend API लगेगी:
    // return fetch("/api/games/color-ball/progress", {...});

    return {
      ok: true,
      state,
    };
  },
};

export {
  SIZE,
  COLORS,
};