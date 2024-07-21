import { getConfig } from '@/configs/config';

export const reverseArray = (arr) => {
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

export const getPlayerByIndex = (game, index) => {
  if (index === 0) {
    return game.player_1;
  } else if (index === 1) {
    return game.player_2;
  } else {
    alert('Error with player index');
    return -1;
  }
};

export const reverseArrayPlayer1 = (arr) => {
  return [arr[7], arr[6], arr[5], arr[4], arr[3], arr[2], arr[1], arr[0]];
};

export const getTokenName = (token_id) => {
  let tokenName = '';
  const { cheddarToken, nekoToken } = getConfig().contracts;
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

export const c1 = (i, current_player) => {
  if (current_player === 0)
    return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][parseInt(i)];
  else if (current_player === 1)
    return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][7 - parseInt(i)];
};

export const c2 = (i, current_player) => {
  if (current_player === 0) return (8 - parseInt(i)).toString();
  else if (current_player === 1) return (1 + parseInt(i)).toString();
};

export const getTimeSpent = (
  total_time_spent,
  last_turn_timestamp,
  is_current_player
) => {
  if (is_current_player) {
    let after_last_turn =
      new Date().getTime() / 1000 - last_turn_timestamp / 1000000000;
    return total_time_spent / 1000000000 + after_last_turn;
  } else {
    return total_time_spent / 1000000000;
  }
};

export const formatTimestamp = (total_seconds) => {
  var sec_num = parseInt(total_seconds, 10);
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  return hours + ':' + minutes + ':' + seconds;
};

export const isOpponentTimeSpent = (time_spent) => {
  return time_spent > 3600;
};

export const dist = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};

export const inRange = (tile, piece, gameBoard) => {
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

export const isValidPlaceToMove = (row, col, gameBoard) => {
  if (row < 0 || row > 7 || col < 0 || col > 7) return false;
  if (gameBoard[row][col] == 0) {
    return true;
  }
  return false;
};

export const getReferralId = (currentUrl) => {
  const urlObject = new URL(currentUrl);
  const params = new URLSearchParams(urlObject.search);
  const referrerId = params.get('r') || '';
  return referrerId;
};
