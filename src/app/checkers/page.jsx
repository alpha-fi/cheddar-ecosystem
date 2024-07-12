'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/styles/style.module.sass';
import {
  useGetAvailableCheckersPlayers,
  useGetAvailableCheckersGames,
  useGetCheckersGame,
} from '@/hooks/checkers';
import {
  getAvailableGames,
  makeMove,
} from '@/contracts/checkers/checkersCalls';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import { Image } from '@chakra-ui/react';

const nft_web4_url = 'https://checkers.cheddar.testnet.page/style';
const NEKO_TOKEN_CONTRACT = 'ftv2.nekotoken.near';
const NEAR = 'NEAR';
// const CHEDDAR_TOKEN_CONTRACT = 'token.cheddar.near';
const CHEDDAR_TOKEN_CONTRACT = 'token-v3.cheddar.testnet';
const players_css = ['player-1', 'player-2'];

// const nft_contract = 'nft.cheddar.near';
const nft_contract = 'nft.cheddar.testnet';

const nearConfig = {
  // networkId: 'mainnet',
  // nodeUrl: 'https://rpc.mainnet.near.org',
  // contractName: 'checkers.cheddar.near',
  // walletUrl: 'https://app.mynearwallet.com',
  // helperUrl: 'https://helper.mainnet.near.org',
  // explorerUrl: 'https://explorer.mainnet.near.org',

  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  contractName: 'checkers.cheddar.testnet',
  walletUrl: 'https://testnet.mynearwallet.com',
  helperUrl: 'https://helper.testnet.near.org',
  explorerUrl: 'https://explorer.testnet.near.org',
};

const GAS_START_GAME = 50000000000000;
const GAS_GIVE_UP = 50000000000000;
const GAS_MOVE = 30000000000000;
const DICTIONARY = [
  '0%',
  '12.5%',
  '25%',
  '37.5%',
  '50%',
  '62.5%',
  '75%',
  '87.5%',
];
const INITIAL_GAME_BOARD = [
  [0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0],
  [0, 2, 0, 2, 0, 2, 0, 2],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
];

function reverseArray(arr) {
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
}

function App() {
  const [isRule, setRule] = useState('true');
  const [currentGameId, setCurrentGameId] = useState(-1);
  const [gameBoard, setGameBoard] = useState(INITIAL_GAME_BOARD);
  const [userInfoShown, setUserInfoShown] = useState(false);
  const [showBurguerMenu, setShowBurguerMenu] = useState(true);
  const [moveBuffer, setMoveBuffer] = useState('');
  const [force_reload, setForce_reload] = useState(false);
  const [last_updated_turn, setLast_updated_turn] = useState(-1);
  const [selectedPiece, setSelectedPiece] = useState({
    row: null,
    col: null,
    piece: null,
  });

  const { accountId } = useWalletSelector();
  const { data: availablePlayersData } = useGetAvailableCheckersPlayers();
  const { data: availableGamesData = [] } = useGetAvailableCheckersGames();
  const { data: gameData } = useGetCheckersGame(currentGameId);
  const { selector } = useWalletSelector();

  const handleRuleToggle = (e) => {
    if (
      e.target.tagName.toLowerCase() == 'a' ||
      e.target.tagName.toLowerCase() == 'svg' ||
      e.target.tagName.toLowerCase() == 'path' ||
      e.target.id == 'rules-layer'
    ) {
      setRule(!isRule);
    }
  };

  const userDropdownHandler = () => {
    setUserInfoShown(!userInfoShown);
  };

  const handlerBurgerMenu = () => {
    setShowBurguerMenu(!showBurguerMenu);
  };

  const handleGiveUp = () => {
    window.give_up();
  };

  const handleStopGame = () => {
    window.stop_game();
  };

  function getPlayerByIndex(game, index) {
    if (index === 0) {
      return game.player_1;
    } else if (index === 1) {
      return game.player_2;
    } else {
      alert('Error with player index');
      return -1;
    }
  }

  function reverseArray(arr) {
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
  }

  const handleClickPiece = (piece, row, col, playerIndex) => {
    console.log(selectedPiece);
    if (gameData.current_player_index !== playerIndex) return;
    setSelectedPiece({ row, col, piece });
  };

  const handleClickTile = (row, col) => {
    console.log(selectedPiece);
    const move = inRange({ row, col });
    console.log(move);
    if (move === 'jump' || move === 'regular') {
      movePiece({ row, col }, selectedPiece);
    }
  };

  const dist = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  };

  const inRange = (tile) => {
    if (!selectedPiece.row || !selectedPiece.col) {
      return;
    }

    if (!isValidPlacetoMove(tile.row, tile.col)) {
      return 'wrong';
    }

    if (
      dist(tile.row, tile.col, selectedPiece.row, selectedPiece.col) ==
      Math.sqrt(2)
    ) {
      if (selectedPiece.piece > 0 && tile.row > selectedPiece.row) {
        return 'regular back';
      }
      return 'regular';
    } else if (
      dist(tile.row, tile.col, selectedPiece.row, selectedPiece.col) ==
      2 * Math.sqrt(2)
    ) {
      if (selectedPiece.piece > 0 && tile.row > selectedPiece.row) {
        return 'jump back';
      }
      return 'jump';
    }
  };

  const isValidPlacetoMove = (row, col) => {
    if (row < 0 || row > 7 || col < 0 || col > 7) return false;
    if (gameBoard[row][col] == 0) {
      return true;
    }
    return false;
  };

  // console.log(gameBoard[0]);
  // console.log(gameBoard[1]);
  // console.log(gameBoard[2]);
  // console.log(gameBoard[3]);
  // console.log(gameBoard[4]);
  // console.log(gameBoard[5]);
  // console.log(gameBoard[6]);
  // console.log(gameBoard[7]);

  const movePiece = async (tile, piece) => {
    let current_move =
      c1(piece.col, gameData.current_player_index) +
      c2(piece.row, gameData.current_player_index) +
      ' ' +
      c1(tile.col, gameData.current_player_index) +
      c2(tile.row, gameData.current_player_index);

    const newBoard = gameBoard;
    newBoard[piece.row][piece.col] = 0;
    newBoard[tile.row][tile.col] = piece.piece;
    setGameBoard(newBoard);

    let double_move = document.getElementById('near-game-double-move').checked;
    // || (e !== undefined && e.shiftKey);
    if (double_move) {
      if (moveBuffer) {
        setMoveBuffer(
          (prevState) =>
            `${prevState} ${c1(tile.col, gameData.current_player_index)}${c2(tile.row, gameData.current_player_index)}`
        );
      } else {
        setMoveBuffer(current_move);
      }
      document.getElementById('near-game-double-move').checked = false;
    } else {
      const wallet = await selector.wallet();
      if (moveBuffer) {
        makeMove(
          wallet,
          currentGameId,
          moveBuffer +
            ' ' +
            c1(tile.col, gameData.current_player_index) +
            c2(tile.row, gameData.current_player_index)
        );
      } else {
        makeMove(wallet, currentGameId, current_move);
      }
      setMoveBuffer('');
    }

    return true;
  };

  function c1(i, current_player) {
    if (current_player === 0)
      return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][parseInt(i)];
    else if (current_player === 1)
      return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][7 - parseInt(i)];
  }

  function c2(i, current_player) {
    if (current_player === 0) return (8 - parseInt(i)).toString();
    else if (current_player === 1) return (1 + parseInt(i)).toString();
  }

  useEffect(() => {
    let myGames = availableGamesData.filter(
      (game) => game[1][0] === accountId || game[1][1] === accountId
    );

    setCurrentGameId(myGames.length > 0 ? myGames[0][0] : -1);
  }, [availableGamesData, accountId]);

  useEffect(() => {
    if (gameData) {
      setGameBoard(
        gameData.player1 === accountId
          ? gameData.board
          : reverseArray(gameData.board)
      );
    }
  }, [gameData, accountId]);
  return (
    <>
      {!isRule && (
        <>
          <div id="rules-layer" onClick={handleRuleToggle}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              className="bi bi-x-circle-fill"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
            </svg>
          </div>
          <div id="near-game-rules">
            <h2>How to play:</h2>
            <ul>
              <li>
                Click a checkbox &quot;double jump&quot; on the top of the board
                before every double jump. Shift key makes the same trick.
              </li>
              <li>
                Set a bid and join waiting list or select an available player to
                start the game.
              </li>
              <li>The winner takes the pot.</li>
              <li>
                Invite a friend to get a 10% referral bonus from his rewards.
              </li>
              <li>
                Hold shift button (or check a checkbox) to perform a double
                jump. Release a shift button before a final move.
              </li>
              <li>
                If you spent more than an hour, your opponent may stop the game
                and get the reward.
              </li>
              <li>
                Service fee is 10%, referral reward is half of the service fee.
              </li>
              <li>Various game stats are storing onchain.</li>
            </ul>
            <div className="subtitle">
              General Game Rules (
              <a
                href="https://en.wikipedia.org/wiki/Draughts"
                target="_blank"
                rel="noopener noreferrer"
              >
                source
              </a>
              )
            </div>
            <ul>
              <li>
                Capturing is mandatory. Double capturing is not mandatory.
              </li>
              <li>
                Uncrowned pieces (men) move one step diagonally forwards, and
                capture an opponent&quot;s piece. Men can jump only forwards.
                Multiple enemy pieces can be captured in a single turn provided
                this is done by successive jumps made by a single piece.
              </li>
              <li>
                Kings acquires additional powers including the ability to move
                backwards and capture backwards.
              </li>
            </ul>
          </div>
        </>
      )}

      <div className="game-container">
        <div className="column" style={{ minHeight: 0, paddingBottom: '30px' }}>
          <div className="info">
            <h1>Cheddar Checkers</h1>

            <div className="only-before-login">
              <div className="subtitle">
                Login with NEAR account (or{' '}
                <a href="//wallet.near.org" target="_blank">
                  create one for free!
                </a>
                )
              </div>
            </div>

            <div className="only-after-login">
              <div id="near-available-players" className="">
                <div className="subtitle">
                  Available players
                  <span id="near-available-players-hint" className="">
                    {' '}
                    (click on a player to start a game)
                  </span>
                  :
                </div>
                <div id="near-available-players-list"></div>
              </div>
              <div id="near-waiting-list" className="">
                <div id="near-make-available-block" className="">
                  <div className="subtitle">
                    <label htmlFor="near-bid-deposit">Join waiting list:</label>
                  </div>
                  <div>
                    My bid:{' '}
                    <input
                      type="text"
                      id="near-bid-deposit"
                      defaultValue={0}
                      style={{ width: '30px' }}
                    />{' '}
                    NEAR
                  </div>
                  <div>
                    Cheddar bid:{' '}
                    <input
                      type="text"
                      id="cheddar-bid-deposit"
                      defaultValue={0}
                      style={{ width: '30px' }}
                    />{' '}
                    Cheddar
                  </div>
                  <div>
                    Neko bid:{' '}
                    <input
                      type="text"
                      id="neko-bid-deposit"
                      defaultValue={0}
                      style={{ width: '30px' }}
                    />{' '}
                    Neko
                  </div>
                  <button className="button" id="near-make-available">
                    Join waiting list
                  </button>
                </div>
                <div id="near-make-unavailable-block" className="">
                  <button className="button" id="near-make-unavailable">
                    Leave waiting list
                  </button>
                </div>
              </div>
              <div id="near-game" className="">
                <div id="near-game-turn-block" className="subtitle">
                  There is an ongoing game on turn #
                  <span id="near-game-turn">...</span>
                </div>
                <div id="near-game-give-up">
                  <button className="button" onClick={handleGiveUp}>
                    Concede
                  </button>
                </div>
                <div id="near-game-finished" className="subtitle ">
                  Game winner: <span id="near-game-winner">...</span>.<br></br>
                  Reward: <span id="near-game-reward">...</span>
                </div>
              </div>
            </div>
            <div style={{ paddingTop: '10px' }}>
              <a href="#" onClick={handleRuleToggle}>
                How to play / Rules (Click to view)
              </a>
            </div>
          </div>
          <div id="near-game-stats" className="stats ">
            <h2>Game Statistics</h2>
            <div className="wrapper">
              <div id="player1">
                <h3>
                  <div style={{ paddingBottom: '5px' }}>
                    <p id="near-game-player-1" style={{ color: '#e4a6ae' }}></p>
                  </div>
                  <div style={{ height: '30px' }}>
                    <span id="near-active-player-1" className="active-player ">
                      (Active)
                    </span>
                  </div>
                </h3>
                <div id="near-player-1-deposit"></div>
                <div id="near-player-1-time-spent"></div>
                <div id="near-player-1-stop-game" className="">
                  <button onClick={handleStopGame} className="button centered">
                    Stop game and get reward
                  </button>
                </div>
              </div>
              <div id="player2">
                <h3>
                  <div style={{ paddingBottom: '5px' }}>
                    <p id="near-game-player-2" style={{ color: '#8b8bff' }}></p>
                  </div>
                  <div style={{ height: '30px' }}>
                    <span id="near-active-player-2" className="active-player ">
                      (Active)
                    </span>
                  </div>
                </h3>
                <div id="near-player-2-deposit"></div>
                <div id="near-player-2-time-spent"></div>
                <div id="near-player-2-stop-game" className="">
                  <button onClick={handleStopGame} className="button centered">
                    Stop game and get reward
                  </button>
                </div>
              </div>
            </div>
            <div className="clearfix"></div>
            <div className="turn"></div>
            <span id="winner"></span>
            <div className="">
              <button id="cleargame">Reload</button>
            </div>
          </div>
          <div className="account only-after-login">
            <div>
              <div id="near-account-ref"></div>
            </div>
          </div>
        </div>
        <div className="column">
          <div
            className="double-jump-button-container"
            style={{ textAlign: 'center' }}
          >
            <input type="checkbox" id="near-game-double-move" />
            <label htmlFor="near-game-double-move">Double jump</label>
          </div>
          <div id="board">
            <div className="tiles">
              {DICTIONARY.map((row, indexRow) => {
                return DICTIONARY.map((col, indexCol) => {
                  return (indexRow + indexCol) % 2 === 0 ? (
                    <></>
                  ) : (
                    <div
                      key={`tile${(indexCol - (indexCol % 2)) / 2 + indexRow * 4}`}
                      class={`tile`}
                      id={`tile${(indexCol - (indexCol % 2)) / 2 + indexRow * 4}`}
                      style={{
                        top: row,
                        left: col,
                        backgroundColor: 'black',
                      }}
                      onClick={() => handleClickTile(indexRow, indexCol)}
                    ></div>
                  );
                });
              })}
            </div>
            <div className="pieces">
              <div className="player1pieces">
                {gameBoard.map((row, indexRow) =>
                  row.map((piece, indexCol) =>
                    piece === 1 || piece === -1 ? (
                      <div
                        key={`piece${(indexCol - (indexCol % 2)) / 2 + indexRow * 4}`}
                        class={`piece ${selectedPiece.row === indexRow && selectedPiece.col === indexCol ? 'selected' : ''}`}
                        id={`piece${(indexCol - (indexCol % 2)) / 2 + indexRow * 4}`}
                        style={{
                          top: DICTIONARY[indexRow],
                          left: DICTIONARY[indexCol],
                        }}
                        onClick={() =>
                          handleClickPiece(piece, indexRow, indexCol, 0)
                        }
                      >
                        {piece === -1 && (
                          <Image
                            src={`./assets/img/king1.png`}
                            alt={`Piece ${(indexCol - (indexCol % 2)) / 2 + indexRow * 4} is king`}
                          />
                        )}
                      </div>
                    ) : (
                      <></>
                    )
                  )
                )}
              </div>
              <div className="player2pieces">
                {gameBoard.map((row, indexRow) =>
                  row.map((piece, indexCol) =>
                    piece === 2 || piece === -2 ? (
                      <div
                        key={`piece${(indexCol - (indexCol % 2)) / 2 + indexRow * 4}`}
                        class={`piece ${selectedPiece.row === indexRow && selectedPiece.col === indexCol ? 'selected' : ''}`}
                        id={`piece${(indexCol - (indexCol % 2)) / 2 + indexRow * 4}`}
                        style={{
                          top: DICTIONARY[indexRow],
                          left: DICTIONARY[indexCol],
                        }}
                        onClick={() =>
                          handleClickPiece(piece, indexRow, indexCol, 1)
                        }
                      >
                        {piece === -2 && (
                          <Image
                            src={`./assets/img/king2.png`}
                            alt={`Piece ${(indexCol - (indexCol % 2)) / 2 + indexRow * 4} is king`}
                          />
                        )}
                      </div>
                    ) : (
                      <></>
                    )
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
