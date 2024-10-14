import React, { createContext, useEffect, useMemo, useState } from 'react';
import { ReactNode } from 'react';
import { useWalletSelector } from '../WalletSelectorContext';

import { useClipboard, useDisclosure } from '@chakra-ui/react';
import { ntoy } from '@/contracts/contractUtils';
import { getConfig } from '@/configs/config';
import { INITIAL_GAME_BOARD } from '@/constants/checkers';
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
  c1,
  c2,
  getTimeSpent,
  formatTimestamp,
  inRange,
  getReferralId,
  checkValidBoard,
} from '@/lib/checkers';

interface props {
  children: ReactNode;
}

interface GameData {
  winner_index: number | null;
  turns: string;
  reward: {
    balance: string | bigint;
    token_id: string;
  };
  player_1: string;
  player_2: string;
  current_player_index: number;
  total_time_spent: number[];
  last_turn_timestamp: number;
}

interface CheckersContextProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  gameData: GameData;
  accountId: string | null;
  availablePlayersData: [];
  handleSelectOpponent: (
    opponentId: any,
    deposit: any,
    tokenId: any
  ) => Promise<void>;
  currentPlayerIsAvailable: any;
  handleMakeUnavailable: () => Promise<void>;
  networkId: string;
  handleBid: () => Promise<void>;
  handleGiveUp: () => Promise<void>;
  handleFinishGame: () => void;
  timeSpent:
    | {
        player1: string;
        player2: string;
      }
    | undefined;
  handleStopGame: () => Promise<void>;
  refValue: string;
  onCopyRef: () => void;
  setIsCheckedDoubleJump: (value: React.SetStateAction<boolean>) => void;
  isCheckedDoubleJump: boolean;
  moveBuffer: string;
  handleCancelMultiMove: () => void;
  handleClickTile: (row: any, col: any) => void;
  gameBoard: number[][];
  selectedPiece: {
    row: null;
    col: null;
    piece: null;
  };
  handleClickPiece: (piece: any, row: any, col: any, playerIndex: any) => void;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
}

export const CheckersContext = createContext<CheckersContextProps>(
  {} as CheckersContextProps
);

export const CheckersContextProvider = ({ children }: props) => {
  const networkId = getConfig().networkData.networkId;

  const [currentGameId, setCurrentGameId] = useState(-1);
  const [gameBoard, setGameBoard] = useState(INITIAL_GAME_BOARD);
  const [timeSpent, setTimeSpent] = useState<{
    player1: string;
    player2: string;
  }>();
  const [moveBuffer, setMoveBuffer] = useState('');
  const [updateBoardByQuery, setUpdateBoardByQuery] = useState(true);
  const [isCheckedDoubleJump, setIsCheckedDoubleJump] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState({
    row: null,
    col: null,
    piece: null,
  });
  const [error, setError] = useState('');

  const { accountId, selector } = useWalletSelector();
  const { data: availablePlayersData = [] } = useGetAvailableCheckersPlayers();
  const { data: availableGamesData = [] } = useGetAvailableCheckersGames();
  const { data: gameData } = useGetCheckersGame(currentGameId);
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
    () => availablePlayersData.find((player: any) => player[0] == accountId),
    [accountId, availablePlayersData]
  );

  const handleGiveUp = async () => {
    try {
      const wallet = await selector.wallet();
      if (!accountId) {
        throw Error('account id undefined');
      }
      await giveUp(wallet, accountId, currentGameId);
    } catch (error: any) {
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
      if (!accountId) {
        throw Error('account id undefined');
      }
      await stopGame(wallet, accountId, currentGameId);
    } catch (error: any) {
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

  const handleSelectOpponent = async (
    opponentId: any,
    deposit: any,
    tokenId: any
  ) => {
    try {
      const referrerId = getReferralId(window.location.href);
      const wallet = await selector.wallet();
      await selectOpponent(
        wallet,
        opponentId,
        deposit,
        tokenId,
        accountId!,
        referrerId
      );
    } catch (error: any) {
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

  const handleMakeUnavailable = async () => {
    try {
      const wallet = await selector.wallet();
      if (!accountId) {
        throw Error('account id undefined');
      }
      await makeUnavailable(wallet, accountId);
    } catch (error: any) {
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

  const handleClickPiece = (
    piece: any,
    row: any,
    col: any,
    playerIndex: any
  ) => {
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

  const handleClickTile = (row: any, col: any) => {
    const move = inRange({ row, col }, selectedPiece, gameBoard);
    if (
      move === 'jump' ||
      move === 'regular' ||
      (selectedPiece.piece &&
        selectedPiece.piece < 0 &&
        (move === 'jump back' || move === 'regular back'))
    ) {
      movePiece({ row, col }, selectedPiece);
    }
  };

  const movePiece = async (tile: any, piece: any) => {
    if (piece.row === null || piece.col === null || piece.piece === null) {
      return;
    }
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
        if (!accountId) {
          throw Error('account id undefined');
        }
        await makeMove(wallet, accountId, currentGameId, current_move);
      } catch (error: any) {
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
    let inputNEAR = document.getElementById(
      'near-bid-deposit'
    ) as HTMLInputElement;

    let inputCheddar = document.getElementById(
      'cheddar-bid-deposit'
    ) as HTMLInputElement;

    let inputNeko = document.getElementById(
      'neko-bid-deposit'
    ) as HTMLInputElement;

    let bidNEAR = parseFloat(inputNEAR ? inputNEAR.value : '0');
    let bidCheddar = parseFloat(inputCheddar ? inputCheddar.value : '0');
    let bidNeko = parseFloat(
      networkId === 'mainnet' && inputNeko ? inputNeko.value : '0'
    );
    const wallet = await selector.wallet();
    if (bidNEAR >= 0.01) {
      const referrerId = getReferralId(window.location.href);
      if (!accountId) {
        throw Error('account id undefined');
      }
      await makeAvailable(
        wallet,
        accountId,
        referrerId,
        ntoy(bidNEAR).toString()
      );
    } else if (bidCheddar >= 1) {
      await makeAvailableFt(
        wallet,
        ntoy(bidCheddar).toString(),
        getConfig().contracts.near.cheddarToken,
        accountId!
      );
    } else if (bidNeko >= 5) {
      await makeAvailableFt(
        wallet,
        ntoy(bidNeko).toString(),
        getConfig().contracts.near.nekoToken,
        accountId!
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
        (game: any) => game[1][0] === accountId || game[1][1] === accountId
      );
      setCurrentGameId(myGames.length > 0 ? myGames[0][0] : -1);
    }
  }, [availableGamesData, accountId, currentGameId]);

  useEffect(() => {
    if (
      gameData &&
      /* sometimes after a move by player 2, react query returns within gameData, the board inverted horizontally, so the checkValidBoard function serves to not render the board if it is inverted */
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
    if (!accountId) {
      setGameBoard(INITIAL_GAME_BOARD);
    }
  }, [accountId]);

  useEffect(() => {
    const intervalRef = setInterval(() => {
      if (gameData && gameData.winner_index === null) {
        const player1TimeSpent = formatTimestamp(
          getTimeSpent(
            gameData.total_time_spent[0],
            gameData.last_turn_timestamp,
            gameData.current_player_index === 0
          )
        );
        const player2TimeSpent = formatTimestamp(
          getTimeSpent(
            gameData.total_time_spent[1],
            gameData.last_turn_timestamp,
            gameData.current_player_index === 1
          )
        );

        setTimeSpent({ player1: player1TimeSpent, player2: player2TimeSpent });
      }
    }, 500);

    return () => clearInterval(intervalRef);
  }, [
    gameData,
    gameData?.total_time_spent,
    gameData?.last_turn_timestamp,
    gameData?.current_player_index,
  ]);

  return (
    <CheckersContext.Provider
      value={{
        onClose,
        isOpen,
        gameData,
        accountId,
        availablePlayersData,
        handleSelectOpponent,
        currentPlayerIsAvailable,
        handleMakeUnavailable,
        networkId,
        handleBid,
        handleGiveUp,
        handleFinishGame,
        onOpen,
        timeSpent,
        handleStopGame,
        refValue,
        onCopyRef,
        setIsCheckedDoubleJump,
        isCheckedDoubleJump,
        moveBuffer,
        handleCancelMultiMove,
        handleClickTile,
        gameBoard,
        selectedPiece,
        handleClickPiece,
        error,
        setError,
      }}
    >
      {children}
    </CheckersContext.Provider>
  );
};
