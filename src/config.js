const animationSpeedData = [
  {
    desc: "Snail's pace",
    cardTurnTime: 600,
    cardPauseTime: 800,
    cardMoveTime: 600,
  },
  {
    desc: "Steady Eddie",
    cardTurnTime: 200,
    cardPauseTime: 600,
    cardMoveTime: 400,
  },
  {
    desc: "Super fast",
    cardTurnTime: 50,
    cardPauseTime: 150,
    cardMoveTime: 200,
  },
];

const cardFlipHeightFactor = 0.2;

const defaultCardWidth = 180;
const defaultCardHeight = 240;
const cardPadding = 40;

export {
  animationSpeedData,
  cardFlipHeightFactor,
  cardPadding,
  defaultCardWidth,
  defaultCardHeight,
};
