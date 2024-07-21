'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import {
  Button,
  HStack,
  Image,
  Stack,
  useClipboard,
  useDisclosure,
} from '@chakra-ui/react';
import { ntoy, yton } from '@/contracts/contractUtils';
import { getConfig } from '@/configs/config';
import { DICTIONARY, INITIAL_GAME_BOARD } from '@/constants/checkers';
import {
  useGetAvailableCheckersPlayers,
  useGetAvailableCheckersGames,
  useGetCheckersGame,
} from '@/hooks/checkers';
import {
  giveUp,
  makeMove,
  makeAvailable,
  selectOpponent,
  stopGame,
  makeUnavailable,
  makeAvailableFt,
} from '@/contracts/checkers/checkersCalls';
import {
  reverseArray,
  getPlayerByIndex,
  reverseArrayPlayer1,
  getTokenName,
  c1,
  c2,
  getTimeSpent,
  formatTimestamp,
  isOpponentTimeSpent,
  inRange,
  getReferralId,
  checkValidBoard,
} from '@/lib/checkers';
import { ModalContainer } from '@/components/ModalContainer';

const networkId = getConfig().networkData.networkId;

function App() {
  const [currentGameId, setCurrentGameId] = useState(-1);
  const [gameBoard, setGameBoard] = useState(INITIAL_GAME_BOARD);
  const [moveBuffer, setMoveBuffer] = useState('');
  const [updateBoardByQuery, setUpdateBoardByQuery] = useState(true);
  const [isCheckedDoubleJump, setIsCheckedDoubleJump] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState({
    row: null,
    col: null,
    piece: null,
  });
  const [error, setError] = useState('');

  const { accountId } = useWalletSelector();
  const { data: availablePlayersData = [] } = useGetAvailableCheckersPlayers();
  const { data: availableGamesData = [] } = useGetAvailableCheckersGames();
  const { data: gameData } = useGetCheckersGame(currentGameId);
  const { selector } = useWalletSelector();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const {
    onCopy: onCopyRef,
    setValue: setRefValue,
    value: refValue,
  } = useClipboard(
    window.location.origin +
      window.location.pathname +
      '/?r=' +
      (accountId ?? '')
  );

  const currentPlayerIsAvailable = useMemo(
    () => availablePlayersData.find((player) => player[0] == accountId),
    [accountId, availablePlayersData]
  );

  const handleGiveUp = async () => {
    try {
      const wallet = await selector.wallet();
      await giveUp(wallet, currentGameId);
    } catch (error) {
      let string = JSON.stringify(error);
      let error_begins = string.indexOf('***');
      if (error_begins !== -1) {
        let error_ends = string.indexOf("'", error_begins);
        setError(string.substring(error_begins + 4, error_ends));
      } else if (error.message) {
        setError(error.message);
      } else {
        setError(
          'An unexpected error has occurred, please try again later. If nothing works, contact cheddar support team.'
        );
      }
      setUpdateBoardByQuery(true);
    }
  };

  const handleStopGame = async () => {
    try {
      const wallet = await selector.wallet();
      await stopGame(wallet, currentGameId);
    } catch (error) {
      let string = JSON.stringify(error);
      let error_begins = string.indexOf('***');
      if (error_begins !== -1) {
        let error_ends = string.indexOf("'", error_begins);
        setError(string.substring(error_begins + 4, error_ends));
      } else if (error.message) {
        setError(error.message);
      } else {
        setError(
          'An unexpected error has occurred, please try again later. If nothing works, contact cheddar support team.'
        );
      }
      setUpdateBoardByQuery(true);
    }
  };

  const handleSelectOpponent = async (opponentId, deposit, tokenId) => {
    try {
      const referrerId = getReferralId(window.location.href);
      const wallet = await selector.wallet();
      await selectOpponent(
        wallet,
        opponentId,
        deposit,
        tokenId,
        accountId,
        referrerId
      );
    } catch (error) {
      let string = JSON.stringify(error);
      let error_begins = string.indexOf('***');
      if (error_begins !== -1) {
        let error_ends = string.indexOf("'", error_begins);
        setError(string.substring(error_begins + 4, error_ends));
      } else if (error.message) {
        setError(error.message);
      } else {
        setError(
          'An unexpected error has occurred, please try again later. If nothing works, contact cheddar support team.'
        );
      }
      setUpdateBoardByQuery(true);
    }
  };

  const handleMakeUnavailable = async (opponentId, deposit, tokenId) => {
    try {
      const wallet = await selector.wallet();
      await makeUnavailable(wallet);
    } catch (error) {
      let string = JSON.stringify(error);
      let error_begins = string.indexOf('***');
      if (error_begins !== -1) {
        let error_ends = string.indexOf("'", error_begins);
        setError(string.substring(error_begins + 4, error_ends));
      } else if (error.message) {
        setError(error.message);
      } else {
        setError(
          'An unexpected error has occurred, please try again later. If nothing works, contact cheddar support team.'
        );
      }
      setUpdateBoardByQuery(true);
    }
  };

  const handleClickPiece = (piece, row, col, playerIndex) => {
    if (
      !gameData ||
      gameData.winner_index !== null ||
      gameData.current_player_index !== playerIndex ||
      getPlayerByIndex(gameData, gameData.current_player_index) !== accountId ||
      moveBuffer
    )
      return;
    setSelectedPiece({ row, col, piece });
  };

  const handleClickTile = (row, col) => {
    const move = inRange({ row, col }, selectedPiece, gameBoard);
    if (
      move === 'jump' ||
      move === 'regular' ||
      (selectedPiece.piece < 0 &&
        (move === 'jump back' || move === 'regular back'))
    ) {
      movePiece({ row, col }, selectedPiece);
    }
  };

  const movePiece = async (tile, piece) => {
    let current_move =
      c1(piece.col, gameData.current_player_index) +
      c2(piece.row, gameData.current_player_index) +
      ' ' +
      c1(tile.col, gameData.current_player_index) +
      c2(tile.row, gameData.current_player_index);

    setGameBoard((prevState) => {
      const newBoard = prevState;
      newBoard[piece.row][piece.col] = 0;
      newBoard[tile.row][tile.col] = piece.piece;
      return newBoard;
    });

    if (isCheckedDoubleJump) {
      if (moveBuffer) {
        setMoveBuffer(
          (prevState) =>
            `${prevState} ${c1(tile.col, gameData.current_player_index)}${c2(tile.row, gameData.current_player_index)}`
        );
      } else {
        setMoveBuffer(current_move);
      }
      setSelectedPiece((prevState) => {
        return { ...prevState, row: tile.row, col: tile.col };
      });
      setIsCheckedDoubleJump(false);
    } else {
      if (moveBuffer) {
        current_move =
          moveBuffer +
          ' ' +
          c1(tile.col, gameData.current_player_index) +
          c2(tile.row, gameData.current_player_index);
      }
      try {
        const wallet = await selector.wallet();
        await makeMove(wallet, currentGameId, current_move);
      } catch (error) {
        let string = JSON.stringify(error);
        let error_begins = string.indexOf('***');
        if (error_begins !== -1) {
          let error_ends = string.indexOf("'", error_begins);
          setError(string.substring(error_begins + 4, error_ends));
        } else if (error.message) {
          setError(error.message);
        } else {
          setError(
            'An unexpected error has occurred, please try again later. If nothing works, contact cheddar support team.'
          );
        }
        setUpdateBoardByQuery(true);
      }
      setSelectedPiece({ row: null, col: null, piece: null });
      setMoveBuffer('');
    }
  };

  const handleBid = async () => {
    let bidNEAR = parseFloat(document.getElementById('near-bid-deposit').value);
    let bidCheddar = parseFloat(
      document.getElementById('cheddar-bid-deposit').value
    );
    let bidNeko = parseFloat(
      networkId === 'mainnet'
        ? document.getElementById('neko-bid-deposit').value
        : '0'
    );
    const wallet = await selector.wallet();
    if (bidNEAR >= 0.01) {
      const referrerId = getReferralId(window.location.href);
      await makeAvailable(wallet, referrerId, ntoy(bidNEAR.toString()));
    } else if (bidCheddar >= 1) {
      await makeAvailableFt(
        wallet,
        ntoy(bidCheddar.toString()),
        getConfig().contracts.cheddarToken,
        accountId
      );
    } else if (bidNeko >= 5) {
      await makeAvailableFt(
        wallet,
        ntoy(bidNeko.toString()),
        getConfig().contracts.nekoToken,
        accountId
      );
    } else {
      setError('Bid should be > 0.01 NEAR or > 1 Cheddar or > 5 Neko');
    }
  };

  const handleCancelMultiMove = () => {
    setGameBoard(
      gameData.player_1 === accountId
        ? reverseArrayPlayer1(gameData.board)
        : reverseArray(gameData.board)
    );
    setMoveBuffer('');
  };

  const handleFinishGame = () => {
    setCurrentGameId(-1);
  };

  useEffect(() => {
    if (currentGameId === -1) {
      let myGames = availableGamesData.filter(
        (game) => game[1][0] === accountId || game[1][1] === accountId
      );
      setCurrentGameId(myGames.length > 0 ? myGames[0][0] : -1);
    }
  }, [availableGamesData, accountId, currentGameId]);

  useEffect(() => {
    if (
      gameData &&
      checkValidBoard(gameData.board) &&
      (getPlayerByIndex(gameData, gameData.current_player_index) !==
        accountId ||
        updateBoardByQuery)
    ) {
      setGameBoard(
        gameData.player_1 === accountId
          ? reverseArrayPlayer1(gameData.board)
          : reverseArray(gameData.board)
      );
      setUpdateBoardByQuery(
        getPlayerByIndex(gameData, gameData.current_player_index) !== accountId
      );
    }
  }, [accountId, updateBoardByQuery, gameData, gameData?.board]);

  useEffect(() => {
    setRefValue(
      window.location.origin +
        window.location.pathname +
        '/?r=' +
        (accountId ?? '')
    );
  }, [accountId]);

  return (
    <>
      <ModalContainer
        onClose={onClose}
        onOpen={onOpen}
        isOpen={isOpen}
        maxW={{ base: '385px', md: '600px' }}
      >
        <h2>How to play:</h2>
        <ul style={{ marginLeft: '16px' }}>
          <li>
            Click a checkbox &quot;double jump&quot; on the top of the board
            before every double jump.
            {/* Shift key makes the same trick. */}
          </li>
          <li>
            Set a bid and join waiting list or select an available player to
            start the game.
          </li>
          <li>The winner takes the pot.</li>
          <li>Invite a friend to get a 10% referral bonus from his rewards.</li>
          <li>
            Check a checkbox to perform a double jump. don&apos;t check before a
            final move.
          </li>
          {/* <li>
            Hold shift button (or check a checkbox) to perform a double jump.
            Release a shift button before a final move.
          </li> */}
          <li>
            If you spent more than an hour, your opponent may stop the game and
            get the reward.
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
            style={{ color: 'white', textDecoration: 'underline' }}
          >
            source
          </a>
          )
        </div>
        <ul style={{ marginLeft: '16px' }}>
          <li>Capturing is mandatory. Double capturing is not mandatory.</li>
          <li>
            Uncrowned pieces (men) move one step diagonally forwards, and
            capture an opponent&apos;s piece. Men can jump only forwards.
            Multiple enemy pieces can be captured in a single turn provided this
            is done by successive jumps made by a single piece.
          </li>
          <li>
            Kings acquires additional powers including the ability to move
            backwards and capture backwards.
          </li>
        </ul>
      </ModalContainer>

      <Stack
        direction={{ base: gameData ? 'column-reverse' : 'column', lg: 'row' }}
      >
        <div className="column" style={{ minHeight: 0, paddingBottom: '30px' }}>
          <div className="info">
            <h1>Cheddar Checkers</h1>

            {!accountId && (
              <div className="only-before-login">
                <div className="subtitle">
                  Login with NEAR account (or{' '}
                  <a href="https://www.mynearwallet.com/" target="_blank">
                    create one for free!
                  </a>
                  )
                </div>
              </div>
            )}
            {accountId && (
              <div className="only-after-login">
                {!gameData && (
                  <>
                    <div id="near-available-players" className="">
                      <div className="subtitle">
                        Available players
                        <span id="near-available-players-hint" className="">
                          {' '}
                          (click on a player to start a game)
                        </span>
                        :
                      </div>
                      <div id="near-available-players-list">
                        {availablePlayersData.map((player) => {
                          const token_id = player[1].token_id;
                          let displayableTokenName = getTokenName(token_id);
                          if (player[0] !== accountId) {
                            return (
                              <li key={player}>
                                <div
                                  onClick={() =>
                                    handleSelectOpponent(
                                      player[0],
                                      player[1].deposit,
                                      token_id
                                    )
                                  }
                                  style={{
                                    cursor: 'pointer',
                                    display: 'inline',
                                    textDecoration: 'underline',
                                  }}
                                >
                                  {player[0]}, bid: {yton(player[1].deposit)}{' '}
                                  {displayableTokenName}
                                </div>
                              </li>
                            );
                          } else {
                            return (
                              <li key={player}>
                                <strong>
                                  {player[0]}, bid: {yton(player[1].deposit)}{' '}
                                  {displayableTokenName}
                                </strong>
                              </li>
                            );
                          }
                        })}
                      </div>
                    </div>
                    <div id="near-waiting-list" className="">
                      {currentPlayerIsAvailable ? (
                        <div
                          id="near-make-unavailable-block"
                          className=""
                          onClick={handleMakeUnavailable}
                        >
                          <Button
                            colorScheme="purple"
                            id="near-make-unavailable"
                          >
                            Leave waiting list
                          </Button>
                        </div>
                      ) : (
                        <div id="near-make-available-block" className="">
                          <div className="subtitle">
                            <label htmlFor="near-bid-deposit">
                              Join waiting list:
                            </label>
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
                          {networkId === 'mainnet' && (
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
                          )}
                          <Button
                            colorScheme="purple"
                            id="near-make-available"
                            onClick={handleBid}
                          >
                            Join waiting list
                          </Button>
                        </div>
                      )}
                    </div>
                  </>
                )}
                {gameData && gameData.winner_index === null && (
                  <div id="near-game" className="">
                    <div id="near-game-turn-block" className="subtitle">
                      There is an ongoing game on turn #
                      <span id="near-game-turn">{gameData.turns}</span>
                    </div>
                    <div id="near-game-give-up">
                      <Button colorScheme="purple" onClick={handleGiveUp}>
                        Concede
                      </Button>
                    </div>
                  </div>
                )}
                {gameData && gameData.winner_index !== null && (
                  <>
                    <div id="near-game-finished" className="subtitle ">
                      Game winner:{' '}
                      <span id="near-game-winner">
                        {getPlayerByIndex(gameData, gameData.winner_index)}
                      </span>
                      <br></br>
                      Reward:{' '}
                      <span id="near-game-reward">
                        {yton(gameData.reward.balance)}{' '}
                        {getTokenName(gameData.reward.token_id)}
                      </span>
                    </div>
                    <Button colorScheme="purple" onClick={handleFinishGame}>
                      Close game
                    </Button>
                  </>
                )}
              </div>
            )}
            <div style={{ paddingTop: '10px' }}>
              <a onClick={onOpen} style={{ cursor: 'pointer' }}>
                How to play / Rules (Click to view)
              </a>
            </div>
          </div>
          {gameData && (
            <div id="near-game-stats" className="stats ">
              <h2>Game Statistics</h2>
              <div className="wrapper">
                <div id="player1">
                  <h3>
                    <div style={{ paddingBottom: '5px' }}>
                      <p id="near-game-player-1" style={{ color: '#e4a6ae' }}>
                        {gameData.player_1}
                      </p>
                    </div>
                    <div style={{ height: '30px' }}>
                      {gameData && gameData.current_player_index === 0 && (
                        <span
                          id="near-active-player-1"
                          className="active-player "
                        >
                          (Active)
                        </span>
                      )}
                    </div>
                  </h3>
                  <div id="near-player-1-deposit">
                    {yton(gameData.reward.balance)}{' '}
                    {getTokenName(gameData.reward.token_id)}
                  </div>
                  {gameData && (
                    <div id="near-player-1-time-spent">
                      {formatTimestamp(
                        getTimeSpent(
                          gameData.total_time_spent[0],
                          gameData.last_turn_timestamp,
                          gameData.current_player_index === 0
                        )
                      )}
                    </div>
                  )}
                  <div id="near-player-1-stop-game" className="">
                    {gameData.player_1 === accountId &&
                      isOpponentTimeSpent(
                        getTimeSpent(
                          gameData.total_time_spent[0],
                          gameData.last_turn_timestamp,
                          gameData.current_player_index === 0
                        )
                      ) && (
                        <button
                          onClick={handleStopGame}
                          className="button centered"
                        >
                          Stop game and get reward
                        </button>
                      )}
                  </div>
                </div>
                <div id="player2">
                  <h3>
                    <div style={{ paddingBottom: '5px' }}>
                      <p id="near-game-player-2" style={{ color: '#8b8bff' }}>
                        {gameData.player_2}
                      </p>
                    </div>
                    <div style={{ height: '30px' }}>
                      {gameData && gameData.current_player_index === 1 && (
                        <span
                          id="near-active-player-2"
                          className="active-player "
                        >
                          (Active)
                        </span>
                      )}{' '}
                    </div>
                  </h3>
                  <div id="near-player-2-deposit">
                    {yton(gameData.reward.balance)}{' '}
                    {getTokenName(gameData.reward.token_id)}
                  </div>
                  {gameData && (
                    <div id="near-player-1-time-spent">
                      {formatTimestamp(
                        getTimeSpent(
                          gameData.total_time_spent[1],
                          gameData.last_turn_timestamp,
                          gameData.current_player_index === 1
                        )
                      )}
                    </div>
                  )}
                  <div id="near-player-2-stop-game" className="">
                    {gameData.player_2 === accountId &&
                      isOpponentTimeSpent(
                        getTimeSpent(
                          gameData.total_time_spent[1],
                          gameData.last_turn_timestamp,
                          gameData.current_player_index === 1
                        )
                      ) && (
                        <button
                          onClick={handleStopGame}
                          className="button centered"
                        >
                          Stop game and get reward
                        </button>
                      )}
                  </div>
                </div>
              </div>
              <div className="clearfix"></div>
              <div className="turn"></div>
              <span id="winner"></span>
              {/* <div className="">
                <button id="cleargame">Reload</button>
              </div> */}
            </div>
          )}
          <div className="account only-after-login">
            <div>
              <div id="near-account-ref">
                <div>Invite a friend to get a 10% referral bonus:</div>
                <div class="invitation-input-line">
                  <input class="invitation-code" type="text" value={refValue} />
                  <svg
                    onClick={onCopyRef}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="feather feather-copy"
                  >
                    <rect
                      x="9"
                      y="9"
                      width="13"
                      height="13"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="column">
          <HStack justifyContent="center">
            <div
              className="double-jump-button-container"
              style={{ textAlign: 'center' }}
            >
              <input
                type="checkbox"
                id="near-game-double-move"
                onClick={(e) => setIsCheckedDoubleJump(e.target.checked)}
                checked={isCheckedDoubleJump}
              />
              <label htmlFor="near-game-double-move">Double jump</label>
            </div>
            {moveBuffer && (
              <Button
                colorScheme="purple"
                onClick={handleCancelMultiMove}
                h="34px"
              >
                Cancel move
              </Button>
            )}
          </HStack>
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
      </Stack>
      <ModalContainer
        title="Error"
        isOpen={error !== ''}
        onClose={() => setError('')}
      >
        {error}
      </ModalContainer>
    </>
  );
}

export default App;
