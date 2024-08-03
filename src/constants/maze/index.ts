import { COLORS } from '..';

export const IS_TEST_PLINKO = process.env.NEXT_PUBLIC_IS_TEST_PLINKO === 'true';

export const IS_TEST_WIN = process.env.NEXT_PUBLIC_IS_TEST_WIN === 'true';

export const IS_TEST_CARTEL = process.env.NEXT_PUBLIC_IS_TEST_CARTEL === 'true';

export const IS_TEST_PORTAL_TO_SECOND_MAZE =
  process.env.NEXT_PUBLIC_IS_TEST_PORTAL_TO_SECOND_MAZE === 'true';

export const IS_TEST_DOORS_MINIGAME =
  process.env.NEXT_PUBLIC_IS_TEST_DOORS_MINIGAME === 'true';

export const TIME_LIMIT_IN_SECONDS = 120;

export const MAZE_COLS = 8;
export const MAZE_COLS_LARGE_DEVICES = 9;
export const MAZE_COLS_SMALL_DEVICES = 8;

export const MAZE_ROWS = 11;
export const MAZE_ROWS_SMALL_DEVICES = 10;

export const MAX_SCORE_TO_CHOOSE_DOOR = 15;

export const AMOUNT_OF_CHEDDAR_IN_BAG = 5;

export const MIN_COVERED_CELLS_TO_FIND_EXIT = 0.75;
export const MIN_TIME_LEFT_TO_FIND_PLINKO = 60;

export const POINTS_OF_ACTIONS = {
  cheddarFound: 1,
  bagFound: 1,
  enemyDefeated: 1,
  moveWithoutDying: 0,
  plinkoGameFound: 2,
};

export const CHANCES_OF_FINDING = {
  exit: 0.0021,
  enemy: 0.19,
  cheese: 0.055,
  bag: 0.027,
  cartel: 0.0002,
  plinko: 0.01,
  doorsMinigame: 0.01,

  portalToSecondMaze: 0.025,
};

export const NFT_CHEESE_BUFF_MULTIPLIER = 1.28;

export const NFT_EXIT_BUFF_MULTIPLIER = 10;

export const CARTEL_FOUND_MESSAGE = {
  text: 'You ran into the cartel! Game Over!',
  color: COLORS.danger,
};

export const EXIT_FOUND_MESSAGE = {
  text: 'Congrats! You found the Hidden Door.',
  color: COLORS.success,
};

export const DOORS_MINIGAME_MESSAGE = {
  text: 'You scaped from the battle through a door.',
  color: COLORS.danger,
};
export const CHOOSE_DOORS_MESSAGE = {
  text: 'Enemy won but you get a bonus game. Choose a door.',
  color: COLORS.warning,
};

export const TIME_END_MESSAGE = {
  text: "⏰ Time's up! Game Over!",
  color: COLORS.danger,
};

export const LOST_TO_ENEMY_MESSAGE = {
  text: 'Enemy won! Game Over!',
  color: COLORS.danger,
};
