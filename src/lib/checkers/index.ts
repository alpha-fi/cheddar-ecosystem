import { getConfig } from '@/configs/config';

export const reverseArray = (arr: any) => {
  // https://www.geeksforgeeks.org/program-to-reverse-the-rows-in-a-2d-array/
  // Traverse each row of arr
  for (var i = 0; i < 8; i++) {
    // Initialise start and end index
    var start = 0;
    var end = 8 - 1;

    // Till start < end, swap the element
    // at start and end index
    while (start < end) {
      // Swap the element
      var temp = arr[i][start];
      arr[i][start] = arr[i][end];
      arr[i][end] = temp;

      // Increment start and decrement
      // end for next pair of swapping
      start++;
      end--;
    }
  }

  return arr;
};

export const getPlayerByIndex = (game: any, index: any) => {
  if (index === 0) {
    return game.player_1;
  } else if (index === 1) {
    return game.player_2;
  } else {
    alert('Error with player index');
    return -1;
  }
};

export const reverseArrayPlayer1 = (arr: any) => {
  return [arr[7], arr[6], arr[5], arr[4], arr[3], arr[2], arr[1], arr[0]];
};

export const getTokenName = (token_id: any) => {
  let tokenName = '';
  const { cheddarToken, nekoToken } = getConfig().contracts.near;
  switch (token_id) {
    case cheddarToken:
      tokenName = 'CHEDDAR';
      break;
    case nekoToken:
      tokenName = 'NEKO';
      break;
    default:
      tokenName = 'NEAR';
      break;
  }
  return tokenName;
};

export const c1 = (i: any, current_player: any) => {
  if (current_player === 0)
    return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][parseInt(i)];
  else if (current_player === 1)
    return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][7 - parseInt(i)];
  else return '';
};

export const c2 = (i: any, current_player: any) => {
  if (current_player === 0) return (8 - parseInt(i)).toString();
  else if (current_player === 1) return (1 + parseInt(i)).toString();
  else return '';
};

export const getTimeSpent = (
  total_time_spent: any,
  last_turn_timestamp: any,
  is_current_player: any
) => {
  if (is_current_player) {
    let after_last_turn =
      new Date().getTime() / 1000 - last_turn_timestamp / 1000000000;
    return total_time_spent / 1000000000 + after_last_turn;
  } else {
    return total_time_spent / 1000000000;
  }
};

export const formatTimestamp = (total_seconds: any) => {
  const sec_num = parseInt(total_seconds, 10);
  const hours = Math.floor(sec_num / 3600);
  const minutes = Math.floor((sec_num - hours * 3600) / 60);
  const seconds = sec_num - hours * 3600 - minutes * 60;

  const hoursLength = hours.toString().length > 1 ? hours.toString().length : 2;
  return (
    hours.toString().padStart(hoursLength, '0') +
    ':' +
    minutes.toString().padStart(2, '0') +
    ':' +
    seconds.toString().padStart(2, '0')
  );
};

export const isOpponentTimeSpent = (time_spent: any) => {
  return time_spent > 3600;
};

export const dist = (x1: any, y1: any, x2: any, y2: any) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

export const inRange = (tile: any, piece: any, gameBoard: any) => {
  if (!piece.row === null || !piece.col === null) {
    return;
  }

  if (!isValidPlaceToMove(tile.row, tile.col, gameBoard)) {
    return 'wrong';
  }

  if (dist(tile.row, tile.col, piece.row, piece.col) == Math.sqrt(2)) {
    if (tile.row > piece.row) {
      return 'regular back';
    }
    return 'regular';
  } else if (
    dist(tile.row, tile.col, piece.row, piece.col) ==
    2 * Math.sqrt(2)
  ) {
    if (tile.row > piece.row) {
      return 'jump back';
    }
    return 'jump';
  }
};

export const isValidPlaceToMove = (row: any, col: any, gameBoard: any) => {
  if (row < 0 || row > 7 || col < 0 || col > 7) return false;
  if (gameBoard[row][col] == 0) {
    return true;
  }
  return false;
};

export const getReferralId = (currentUrl: any) => {
  const urlObject = new URL(currentUrl);
  const params = new URLSearchParams(urlObject.search);
  const referrerId = params.get('r') || '';
  return referrerId;
};

export const checkValidBoard = (board: any) => {
  let isValid = true;
  board.forEach((row: any, rowIndex: any) => {
    row.forEach((piece: any, colIndex: any) => {
      if ((rowIndex + colIndex) % 2 === 1 && piece !== 0) {
        isValid = false;
      }
    });
  });
  return isValid;
};
