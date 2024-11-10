import { Coordinates } from '@/entities/interfaces';
import React, {
  ReactNode,
  createContext,
  useEffect,
  useState,
  KeyboardEvent,
  useRef,
} from 'react';

import { callEndGame, getSeedId } from '@/queries/maze/api';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import { RNG } from '@/entities/maze/RNG';
import {
  ScoreboardResponse,
  useGetEarnedAndMintedCheddar,
  useGetEarnedButNotMintedCheddar,
  useGetPendingCheddarToMint,
  useGetScoreboard,
} from '@/hooks/maze';
import { NFT } from '@/contracts/nftCheddarContract';
import {
  useGetCheddarNFTs,
  useIsNadabotVerfified,
  useIsHolonymVerfified,
} from '@/hooks/cheddar';
import { useDisclosure, useToast } from '@chakra-ui/react';
import { getNFTs } from '@/contracts/cheddarCalls';
import { useGlobalContext } from '../GlobalContext';

interface props {
  children: ReactNode;
}

export interface MazeTileData {
  isPath: boolean;
  isActive: boolean;
  enemyWon: boolean;

  hasCheese: boolean;
  hasBag: boolean;
  hasEnemy: boolean;
  hasExit: boolean;
  hasCartel: boolean;
  hasPlinko: boolean;
  hasNothing: boolean;

  fight: boolean;
}

const amountOfCheddarInBag = 5;

const pointsOfActions = {
  cheddarFound: 1,
  bagFound: 1,
  enemyDefeated: 1,
  moveWithoutDying: 0,
  plinkoGameFound: 2,
};

const isTestPlinko = process.env.NEXT_PUBLIC_NETWORK === 'local' && false;
const isTestWin = process.env.NEXT_PUBLIC_NETWORK === 'local' && false;
const isTestCartel = process.env.NEXT_PUBLIC_NETWORK === 'local' && false;

interface GameContextProps {
  isMobile: boolean;

  mazeData: MazeTileData[][];
  setMazeData: React.Dispatch<React.SetStateAction<MazeTileData[][]>>;

  playerPosition: Coordinates;
  setPlayerPosition: React.Dispatch<React.SetStateAction<Coordinates>>;

  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;

  gameOverFlag: boolean;
  setGameOverFlag: React.Dispatch<React.SetStateAction<boolean>>;

  gameOverMessage: string;
  setGameOverMessage: React.Dispatch<React.SetStateAction<string>>;

  timerStarted: boolean;
  setTimerStarted: React.Dispatch<React.SetStateAction<boolean>>;

  direction: 'right' | 'left' | 'down' | 'up';
  setDirection: React.Dispatch<
    React.SetStateAction<'right' | 'left' | 'down' | 'up'>
  >;

  selectedColorSet: number;
  setSelectedColorSet: React.Dispatch<React.SetStateAction<number>>;

  lastCellX: number;
  setLastCellX: React.Dispatch<React.SetStateAction<number>>;
  lastCellY: number;
  setLastCellY: React.Dispatch<React.SetStateAction<number>>;

  hasPowerUp: boolean;
  setHasPowerUp: React.Dispatch<React.SetStateAction<boolean>>;

  isPowerUpOn: boolean;
  setIsPowerUpOn: React.Dispatch<React.SetStateAction<boolean>>;

  remainingTime: number;
  setRemainingTime: React.Dispatch<React.SetStateAction<number>>;

  timeLimitInSeconds: number;
  setTimeLimitInSeconds: React.Dispatch<React.SetStateAction<number>>;

  loadingRemainingMinutesAndSeconds: boolean;

  remainingMinutes: number;
  setRemainingMinutes: React.Dispatch<React.SetStateAction<number>>;

  remainingSeconds: number;
  setRemainingSeconds: React.Dispatch<React.SetStateAction<number>>;

  cheeseCooldown: boolean;
  setCheeseCooldown: React.Dispatch<React.SetStateAction<boolean>>;

  bagCooldown: boolean;
  setBagCooldown: React.Dispatch<React.SetStateAction<boolean>>;

  enemyCooldown: boolean;
  setEnemyCooldown: React.Dispatch<React.SetStateAction<boolean>>;

  moves: number;
  setMoves: React.Dispatch<React.SetStateAction<number>>;

  won: boolean;
  setWon: React.Dispatch<React.SetStateAction<boolean>>;
  touchStart: Coordinates;
  setTouchStart: React.Dispatch<React.SetStateAction<Coordinates>>;
  touchEnd: Coordinates;
  setTouchEnd: React.Dispatch<React.SetStateAction<Coordinates>>;
  coveredCells: string[];
  setCoveredCells: React.Dispatch<React.SetStateAction<string[]>>;

  mazeRows: number;
  mazeCols: number;
  totalCells: number;
  pathLength: number;

  handleKeyPress(event: KeyboardEvent<HTMLDivElement>): void;
  handleArrowPress(
    direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'
  ): void;

  restartGame(): void;

  calculateBlurRadius(cellX: number, cellY: number): number;

  handleTouchStart: (event: React.TouchEvent<HTMLDivElement>) => void;

  handleTouchMove: (event: React.TouchEvent<HTMLDivElement>) => void;

  handleMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;

  handleOnMouseOver: (event: React.MouseEvent<HTMLDivElement>) => void;

  handleOnMouseUp: (event: React.MouseEvent<HTMLDivElement>) => void;

  cheddarFound: number;
  setCheddarFound: React.Dispatch<React.SetStateAction<number>>;

  saveResponse: string[] | undefined;
  hasWon: undefined | boolean;
  pendingCheddarToMint: number;
  earnedButNotMintedCheddar: number;
  endGameResponse: any;
  totalMintedCheddarToDate: number;

  nfts: NFT[];

  showMovementButtons: boolean;
  setShowMovementButtons: React.Dispatch<React.SetStateAction<boolean>>;

  timestampStartStopTimerArray: number[];
  timestampEndStopTimerArray: number[];

  plinkoModalOpened: boolean;
  onOpenPlinkoModal: () => void;
  onClosePlinkoModal: () => void;

  closePlinkoModal: () => void;

  scoreboardResponse: ScoreboardResponse | null | undefined;
  isLoadingScoreboard: boolean;

  isVideoModalOpened: boolean;
  onOpenVideoModal: () => void;
  onCloseVideoModal: () => void;

  isScoreboardOpen: boolean;
  onOpenScoreboard: () => void;
  onCloseScoreboard: () => void;

  seedId: number;

  isUserNadabotVerfied: boolean | undefined;
  isUserHolonymVerified: boolean | undefined;
}

interface StoredGameInfo {
  mazeData: MazeTileData[][];
  pathLength: number;
  playerPosition: Coordinates;
  score: number;
  startTimestamp: number | null;
  cheeseCooldown: boolean;
  bagCooldown: boolean;
  cellsWithItemAmount: number;
  coveredCells: string[];
  cheddarFound: number;
  seedId: number;
  hasFoundPlinko: boolean;
  moves: number;
  accountId: string | null;
  timestampStartStopTimerArray: number[];
  timestampEndStopTimerArray: number[];
}

export const GameContext = createContext<GameContextProps>(
  {} as GameContextProps
);

export const GameContextProvider = ({ children }: props) => {
  const gameOverRefSent = useRef(false);
  const isMobile = useRef(
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );

  const {
    isOpen: isScoreboardOpen,
    onOpen: onOpenScoreboard,
    onClose: onCloseScoreboard,
  } = useDisclosure();

  const storedGameInfo = useRef(
    localStorage.getItem('stored_cheddar_echosystem_maze_game')
  );
  const storedGameInfoParsed =
    storedGameInfo.current &&
    (JSON.parse(storedGameInfo.current) as StoredGameInfo | null);

  const { accountId, selector } = useWalletSelector();

  const [timeLimitInSeconds, setTimeLimitInSeconds] = useState(120);
  const [startTimestamp, setStartTimestamp] = useState<number | null>(
    // getDefaultOrStoredValue('startTimestamp', null)
    null
  );
  const [timestampStartStopTimerArray, setTimestampStartStopTimerArray] =
    useState<number[]>(
      // getDefaultOrStoredValue('timestampStartStopTimerArray', [])
      []
    );

  const [timestampEndStopTimerArray, setTimestampEndStopTimerArray] = useState<
    number[]
  >(
    // getDefaultOrStoredValue('timestampEndStopTimerArray', [])
    []
  );

  const [mazeData, setMazeData] = useState<MazeTileData[][]>(
    // getDefaultOrStoredValue('mazeData', [[]])
    []
  );
  const [pathLength, setPathLength] = useState<number>(
    // getDefaultOrStoredValue('pathLength', 0)
    0
  );
  const [playerPosition, setPlayerPosition] = useState<Coordinates>(
    // getDefaultOrStoredValue('playerPosition', { x: 1, y: 1 })
    { x: 1, y: 1 }
  );
  const [score, setScore] = useState<number>(
    // getDefaultOrStoredValue('score', 0)
    0
  );
  const [gameOverFlag, setGameOverFlag] = useState(false);
  const [fightingEnemyFlag, setFightingEnemyFlag] = useState(false);
  const [gameOverMessage, setGameOverMessage] = useState('');
  const [hasWon, setHasWon] = useState<undefined | boolean>(undefined);
  const [timerStarted, setTimerStarted] = useState<boolean>(
    // getDefaultOrStoredValue('timerStarted', false)
    false
  );
  const [direction, setDirection] = useState(
    'right' as 'right' | 'left' | 'down' | 'up'
  );
  const [selectedColorSet, setSelectedColorSet] = useState(0);
  const [lastCellX, setLastCellX] = useState(-1);
  const [lastCellY, setLastCellY] = useState(-1);
  const [hasPowerUp, setHasPowerUp] = useState(false);
  const [isPowerUpOn, setIsPowerUpOn] = useState(false);

  const [remainingTime, setRemainingTime] = useState<number>(
    // getDefaultOrStoredValue('remainingTime', timeLimitInSeconds)
    timeLimitInSeconds
  );

  const [
    loadingRemainingMinutesAndSeconds,
    setLoadingRemainingMinutesAndSeconds,
  ] = useState<boolean>(!!storedGameInfoParsed);
  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const [cheeseCooldown, setCheeseCooldown] = useState<boolean>(
    // getDefaultOrStoredValue('cheeseCooldown', false)
    false
  );
  const [bagCooldown, setBagCooldown] = useState<boolean>(
    // getDefaultOrStoredValue('bagCooldown', false)
    false
  );
  const [enemyCooldown, setEnemyCooldown] = useState(false);
  const [moves, setMoves] = useState<number>(
    // getDefaultOrStoredValue('moves', 0)
    0
  );

  const [won, setWon] = useState(false);
  const [touchStart, setTouchStart] = useState({ x: -1, y: -1 });
  const [touchEnd, setTouchEnd] = useState({ x: -1, y: -1 });
  const [coveredCells, setCoveredCells] = useState<string[]>(
    // getDefaultOrStoredValue('coveredCells', false)
    []
  );
  const [cellsWithItemAmount, setCellsWithItemAmount] = useState<number>(
    // getDefaultOrStoredValue('cellsWithItemAmount', false)
    0
  );

  const [cheddarFound, setCheddarFound] = useState<number>(
    // getDefaultOrStoredValue('cheddarFound', 0)
    0
  );

  const [seedId, setSeedId] = useState<number>(
    // getDefaultOrStoredValue('seedId', 0)
    0
  );

  const [rng, setRng] = useState(new RNG(0));

  const [saveResponse, setSaveResponse] = useState();
  const [endGameResponse, setEndGameResponse] = useState();

  const [showMovementButtons, setShowMovementButtons] = useState(true);
  const [renderBoard, setRenderBoard] = useState(false); // to update board color on restart

  const [hasFoundPlinko, setHasFoundPlinko] = useState<boolean>(
    // getDefaultOrStoredValue('seedId', false)
    false
  );

  const [isMouseDown, setIsMouseDown] = useState(false);

  const [lastDivId, setLastDivId] = useState('');

  // const [backgroundImage, setBackgroundImage] = useState('');
  // const [rarity, setRarity] = useState('');

  const {
    isOpen: isVideoModalOpened,
    onOpen: onOpenVideoModal,
    onClose: onCloseVideoModal,
  } = useDisclosure();

  const [mazeCols, setMazeCols] = useState(9);
  const [mazeRows, setMazeRows] = useState(10);
  const [totalCells, setTotalCells] = useState(0);

  function handleErrorToast(title: string) {
    toast({
      title,
      status: 'error',
      duration: 9000,
      position: 'bottom-right',
      isClosable: true,
    });
  }

  useEffect(() => {
    if (
      storedGameInfoParsed !== '' &&
      storedGameInfoParsed !== null &&
      storedGameInfoParsed.accountId === accountId
    ) {
      console.log('storedGameInfoParsed: ', storedGameInfoParsed);
      const remainingTimeWithStoredData = calculateRemainingTime(
        storedGameInfoParsed.timestampStartStopTimerArray,
        storedGameInfoParsed.timestampEndStopTimerArray,
        storedGameInfoParsed.startTimestamp
      );
      console.log('remainingTimeWithStoredData: ', remainingTimeWithStoredData);
      if (remainingTimeWithStoredData > 0) {
        setMazeData(storedGameInfoParsed.mazeData);
        setPathLength(storedGameInfoParsed.pathLength);
        setPlayerPosition(storedGameInfoParsed.playerPosition);
        setScore(storedGameInfoParsed.score);
        setStartTimestamp(storedGameInfoParsed.startTimestamp);
        setCheeseCooldown(storedGameInfoParsed.cheeseCooldown);
        setBagCooldown(storedGameInfoParsed.bagCooldown);
        setMoves(storedGameInfoParsed.moves);
        setCoveredCells(storedGameInfoParsed.coveredCells);
        setCellsWithItemAmount(storedGameInfoParsed.cellsWithItemAmount);
        setCheddarFound(storedGameInfoParsed.cheddarFound);
        setSeedId(storedGameInfoParsed.seedId);
        setHasFoundPlinko(storedGameInfoParsed.hasFoundPlinko);
        setTimestampStartStopTimerArray(
          storedGameInfoParsed.timestampStartStopTimerArray
        );
        setTimestampEndStopTimerArray(
          storedGameInfoParsed.timestampEndStopTimerArray
        );
        setRemainingTime(remainingTimeWithStoredData);
        setTimerStarted(true);
      }
    }
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const handleMediaChange = (e: any) => {
      if (!e.matches) {
        setMazeCols(8);
        setMazeRows(10);
        // On mobile make swipe the default
        setShowMovementButtons(false);
      }
    };

    handleMediaChange(mediaQuery);

    mediaQuery.addListener(handleMediaChange);

    return () => mediaQuery.removeListener(handleMediaChange);
  }, []);

  useEffect(() => {
    setTotalCells(mazeRows * mazeCols);
  }, [mazeCols]);

  const {
    data: pendingCheddarToMint = 0,
    isLoading: isLoadingPendingCheddarToMint,
    refetch: refetchPendingCheddarToMint,
    error: pendingCheddarError,
  } = useGetPendingCheddarToMint();

  useEffect(() => {
    if (pendingCheddarError) {
      handleErrorToast(
        "Error occured while retrieving user's pending cheddar!"
      );
    }
  }, [pendingCheddarError]);

  const {
    data: earnedButNotMintedCheddar = 0,
    refetch: refetchEarnedButNotMintedCheddar,
    error: earnedButNotMintedError,
  } = useGetEarnedButNotMintedCheddar();

  useEffect(() => {
    if (earnedButNotMintedError) {
      handleErrorToast("Error occured while retrieving user's earned cheddar!");
    }
  }, [earnedButNotMintedError]);

  const {
    data: totalMintedCheddarToDate = 0,
    refetch: refetchEarnedAndMintedCheddar,
    error: mintedCheddarError,
  } = useGetEarnedAndMintedCheddar();

  useEffect(() => {
    if (mintedCheddarError) {
      handleErrorToast("Error occured while retrieving user's minted cheddar!");
    }
  }, [mintedCheddarError]);

  useEffect(() => {
    function getPathLength() {
      let countPath = 0;
      if (mazeData) {
        mazeData.forEach((row) => {
          row.forEach((cell) => {
            if (cell.isPath) countPath++;
          });
        });
      }
      return countPath;
    }

    setPathLength(getPathLength());
  }, [mazeData, getRandomPathCell]);

  useEffect(() => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    setLoadingRemainingMinutesAndSeconds(false);
    setRemainingMinutes(minutes);
    setRemainingSeconds(seconds);
  }, [remainingTime]);

  useEffect(() => {
    // Asegura que el mouseUp se detecte fuera de los divs también
    window.addEventListener('mouseup', handleOnMouseUp);

    return () => {
      window.removeEventListener('mouseup', handleOnMouseUp);
    };
  }, []);

  const [nfts, setNFTs] = useState<NFT[]>([]);
  const { data: cheddarNFTsData, isLoading: isLoadingCheddarNFTs } =
    useGetCheddarNFTs();

  const { data: isUserNadabotVerfied } = useIsNadabotVerfified(accountId);

  const { data: isUserHolonymVerified } = useIsHolonymVerfified(accountId);

  const {
    blockchain,
    selectedBlockchainAddress,
    setCollapsableNavbarActivated,
  } = useGlobalContext();

  useEffect(() => {
    if (accountId) {
      getNFTs(accountId).then((nfts) => {
        setNFTs(nfts);
      });
    } else {
      setNFTs([]);
    }
  }, [accountId]);

  // Function to select a random color set, background image, and rarity
  const selectRandomColorSet = () => {
    //Check the global.css file.
    const colorSetsQuantity = 3;

    const randomizeColor = Math.floor(
      Math.floor(Math.random() * colorSetsQuantity) + 1
    );

    return randomizeColor;
  };
  const toast = useToast();

  function getRandomPathCell(mazeData: MazeTileData[][]) {
    const pathCells: Coordinates[] = [];
    mazeData.map((row: MazeTileData[], rowIndex: number) => {
      row.map((cell: MazeTileData, colIndex: number) => {
        if (cell.isPath) {
          pathCells.push({ x: colIndex, y: rowIndex });
        }
      });
    });

    return pathCells[rng.nextRange(0, pathCells.length)];
  }

  // Function to restart the game
  async function restartGame() {
    if (!selectedBlockchainAddress) {
      return;
    }

    const newSeedIdResponse = await getSeedId(
      selectedBlockchainAddress,
      blockchain
    );
    if (!newSeedIdResponse.ok) {
      handleErrorToast(newSeedIdResponse.message);

      return;
    }

    await refetchPendingCheddarToMint();
    await refetchEarnedButNotMintedCheddar();
    setSeedId(newSeedIdResponse.seedId);

    setHasWon(undefined);
    setTimerStarted(true);
    setStartTimestamp(Date.now());
    // clearInterval(timerId);
    setScore(0);
    setTimeLimitInSeconds(120);
    setRemainingTime(120);
    setCheddarFound(0);
    setCheeseCooldown(false);
    setBagCooldown(false);
    // setEnemyCooldown(false);
    setMoves(0);
    setGameOverFlag(false);
    setWon(false);
    setGameOverMessage('');
    setDirection('right');
    setCoveredCells([]);
    setSaveResponse(undefined);
    setEndGameResponse(undefined);
    setCellsWithItemAmount(0);
    setRenderBoard(!renderBoard);

    gameOverRefSent.current = false;

    // Regenerate maze data
    const rng = new RNG(newSeedIdResponse.seedId);
    setRng(rng);

    const newMazeData = generateMazeData(mazeRows, mazeCols, rng);

    // Set the maze data with the new maze and player's starting position
    setMazeData(newMazeData);

    const playerStartCell = getRandomPathCell(newMazeData);
    setPlayerPosition({ x: playerStartCell.x, y: playerStartCell.y });
    setLastCellX(-1);
    setLastCellY(-1);
    setCollapsableNavbarActivated(true);
  }

  // Function to generate maze data
  function generateMazeData(rows: number, cols: number, rng: RNG) {
    const maze = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({
        isPath: false,
        isActive: false,
        hasCheese: false,
        hasBag: false,
        hasEnemy: false,
        hasExit: false,
        enemyWon: false,
        hasCartel: false,
        hasPlinko: false,
        fight: false,
        hasNothing: false,
      }))
    );

    // Choose a random starting position on the outer border
    const startEdge = rng.nextRange(0, 4); // 0: top, 1: right, 2: bottom, 3: left
    let x: number, y: number;

    switch (startEdge) {
      case 0: // Top edge
        x = rng.nextRange(1, cols - 2);
        y = 0;
        break;
      case 1: // Right edge
        x = cols - 1;
        y = rng.nextRange(1, rows - 2);
        break;
      case 2: // Bottom edge
        x = rng.nextRange(1, cols - 2);
        y = rows - 1;
        break;
      case 3: // Left edge
        x = 0;
        y = rng.nextRange(1, rows - 2);
        break;
    }
    maze[y!][x!].isPath = true;

    const stack = [[x!, y!]];

    while (stack.length) {
      const [cx, cy] = stack[stack.length - 1];
      const directions: number[][] = [];

      // Check all possible directions
      [
        [2, 0], // Increase step to 2 for wider paths
        [-2, 0], // Increase step to 2 for wider paths
        [0, 2], // Increase step to 2 for wider paths
        [0, -2], // Increase step to 2 for wider paths
      ].forEach(([dx, dy]) => {
        const nx = cx + dx,
          ny = cy + dy;
        if (
          nx >= 0 &&
          nx < cols &&
          ny >= 0 &&
          ny < rows &&
          !maze[ny][nx].isPath
        ) {
          directions.push([nx, ny, cx + dx / 2, cy + dy / 2]); // Adjust coordinates for wider paths
        }
      });

      if (directions.length) {
        const [nx, ny, px, py] =
          directions[rng.nextRange(0, directions.length)];
        maze[ny][nx].isPath = true;
        maze[py][px].isPath = true;
        stack.push([nx, ny]);
      } else {
        stack.pop();
      }
    }

    // Ensure all unreachable columns are connected
    function connectUnreachableColumns() {
      let unreachableColumns: number[] = [];
      for (let c = 0; c < cols; c++) {
        let reachable = false;
        for (let r = 0; r < rows; r++) {
          if (maze[r][c].isPath) {
            reachable = true;
            break;
          }
        }
        if (!reachable) {
          unreachableColumns.push(c);
        }
      }

      // Actively connect unreachable columns
      unreachableColumns.forEach((col) => {
        const row = rng.nextRange(1, rows - 2);
        maze[row][col].isPath = true;

        // Now connect it to the nearest path
        let connected = false;
        for (let r = 0; r < rows; r++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = col + dx;
            if (nx >= 0 && nx < cols && maze[r][nx].isPath) {
              maze[r][col].isPath = true;
              connected = true;
              break;
            }
          }
          if (connected) break;
        }
      });
    }

    connectUnreachableColumns();

    return maze;
  }

  // Inside the component where you're using the Maze component
  useEffect(() => {
    // Generate maze data and set it to the state
    const newMazeData = generateMazeData(mazeRows, mazeCols, new RNG(0));
    setMazeData(newMazeData);

    const randomColorSet = selectRandomColorSet();
    setSelectedColorSet(randomColorSet);
    // setBackgroundImage(randomColorSet.backgroundImage);
    // setRarity(randomColorSet.rarity);

    const playerStartCell = getRandomPathCell(newMazeData);
    setPlayerPosition({ x: playerStartCell.x, y: playerStartCell.y });
  }, [totalCells, renderBoard]); // Empty dependency array to run this effect only once on component mount

  function movePlayer(newX: number, newY: number) {
    if (
      !mazeData[newY] ||
      !mazeData[newY][newX] ||
      !mazeData[newY][newX].isPath
    ) {
      return; // Player cannot move to non-path cells
    }

    const newMazeData = mazeData.map((row: MazeTileData[], rowIndex: number) =>
      row.map((cell: MazeTileData, colIndex: number) => ({
        ...cell,
        isActive: rowIndex === newY && colIndex === newX,
      }))
    );

    // Reset isActive for the previous player position
    newMazeData[playerPosition.y][playerPosition.x].isActive = false;

    // Update player position state
    setPlayerPosition({ x: newX, y: newY });

    // Update mazeData state
    setMazeData(newMazeData);

    // Increment moves count
    setMoves(moves + 1);
    if (!coveredCells.includes(`${newX}${newY}`)) {
      let newCoveredCells = coveredCells;
      newCoveredCells.push(`${newX}${newY}`);
      setCoveredCells(newCoveredCells);
    }

    // Periodically add artifacts to the board based on cooldowns and randomness
    addArtifacts(newX, newY, newMazeData, moves);

    //Store match info in local storage
    const gameInfo = {
      mazeData: newMazeData,
      pathLength,
      playerPosition,
      score,
      startTimestamp,
      cheeseCooldown,
      bagCooldown,
      cellsWithItemAmount,
      coveredCells,
      cheddarFound,
      seedId,
      hasFoundPlinko,
      moves,
      accountId,
      timestampStartStopTimerArray,
      timestampEndStopTimerArray,
    };

    localStorage.setItem(
      'stored_cheddar_echosystem_maze_game',
      JSON.stringify(gameInfo)
    );

    // Set lastCellX and lastCellY to the new player position
    // Update last cell coordinates
    setLastCellX(playerPosition.x);
    setLastCellY(playerPosition.y);
  }

  function doesCellHasArtifact(x: number, y: number) {
    return (
      mazeData[y][x].hasCheese ||
      mazeData[y][x].hasBag ||
      mazeData[y][x].hasEnemy ||
      mazeData[y][x].hasCartel ||
      mazeData[y][x].hasExit ||
      mazeData[y][x].hasNothing
    );
  }

  function showFighting(mazeData: MazeTileData[][], x: number, y: number) {
    const clonedMazeData = mazeData;
    clonedMazeData[y][x].fight = true;

    setFightingEnemyFlag(true);
    setMazeData(clonedMazeData);
  }

  function handleEnemyFound(
    clonedMazeData: MazeTileData[][],
    x: number,
    y: number
  ) {
    // 30% chance of encountering an enemy
    // Code for adding enemy artifact...
    setCellsWithItemAmount(cellsWithItemAmount + 1);
    // Add logic for the enemy defeating the player
    clonedMazeData[y][x].fight = false;
    setFightingEnemyFlag(false);
    if (rng.nextFloat() < 0.02) {
      // 2% chance of the enemy winning
      clonedMazeData[y][x].enemyWon = true;
      clonedMazeData[y][x].isActive = false;

      gameOver('Enemy won! Game Over!', false);
    } else {
      setGameOverFlag(false);
      clonedMazeData[y][x].hasEnemy = true;

      setScore(score + pointsOfActions.enemyDefeated);
      // setEnemyCooldown(true);
      setTimeout(
        () => {
          // setEnemyCooldown(false);
        },
        rng.nextRange(1000, 6000)
      );
    }
  }

  function handleCheeseFound(
    clonedMazeData: MazeTileData[][],
    x: number,
    y: number
  ) {
    // 5.5% chance of winning cheese
    clonedMazeData[y][x].hasCheese = true;
    setCellsWithItemAmount(cellsWithItemAmount + 1);
    setScore(score + pointsOfActions.cheddarFound);
    setCheddarFound(cheddarFound + 1);
    setCheeseCooldown(true);
    setTimeout(
      () => {
        setCheeseCooldown(false);
      },
      rng.nextRange(1000, 6000)
    );
  }

  function handlePlinkoGameFound(
    clonedMazeData: MazeTileData[][],
    x: number,
    y: number
  ) {
    setTimestampStartStopTimerArray([
      ...timestampStartStopTimerArray,
      Date.now(),
    ]);

    // 5.5% chance of winning cheese
    clonedMazeData[y][x].hasPlinko = true;
    setCellsWithItemAmount(cellsWithItemAmount + 1);
    setScore(score + pointsOfActions.plinkoGameFound);

    openPlinkoModal();
  }

  function handleBagFound(
    clonedMazeData: MazeTileData[][],
    x: number,
    y: number
  ) {
    // 5.5% chance of winning cheese
    clonedMazeData[y][x].hasBag = true;
    setCellsWithItemAmount(cellsWithItemAmount + 1);
    setScore(score + pointsOfActions.bagFound);
    setCheddarFound(cheddarFound + 1 * amountOfCheddarInBag);
    setBagCooldown(true);
    setTimeout(
      () => {
        setBagCooldown(false);
      },
      rng.nextRange(1000, 11000)
    );
  }

  function handleCartelFound(
    clonedMazeData: MazeTileData[][],
    x: number,
    y: number
  ) {
    // 0.2% chance of hitting the "cartel" event
    clonedMazeData[y][x].hasCartel = true;
    setCellsWithItemAmount(cellsWithItemAmount + 1);
    gameOver('You ran into the cartel! Game Over!', false);
  }

  function handleNothingFound(
    clonedMazeData: MazeTileData[][],
    x: number,
    y: number
  ) {
    clonedMazeData[y][x].hasNothing = true;
    setCellsWithItemAmount(cellsWithItemAmount + 1);
  }

  function handleExitFound(
    clonedMazeData: MazeTileData[][],
    x: number,
    y: number
  ) {
    clonedMazeData[y][x].hasExit = true;
    setCellsWithItemAmount(cellsWithItemAmount + 1);
    gameOver('Congrats! You found the Hidden Door.', true);
  }

  const chancesOfFinding = {
    exit: 0.0022,
    enemy: 0.05,
    cheese: 0.055,
    bag: 0.027,
    cartel: 0.0002,
    plinko: 0.01,
    safe: 0.2,
  };

  const NFTCheeseBuffMultiplier = 1.28;
  const NFTExitBuffMultiplier = 10;

  function getChancesOfFindingCheese() {
    if (nfts.length > 0) {
      return chancesOfFinding.cheese * NFTCheeseBuffMultiplier;
    }
    return chancesOfFinding.cheese;
  }

  function getChancesOfFindingExit() {
    if (nfts.length > 0) {
      return chancesOfFinding.exit * NFTExitBuffMultiplier;
    }
    return chancesOfFinding.exit;
  }

  function addArtifacts(
    newX: number,
    newY: number,
    newMazeData: MazeTileData[][],
    moves: number
  ) {
    if (gameOverFlag /* && moves >= 10*/) {
      return;
    }
    if (doesCellHasArtifact(newX, newY)) {
      return;
    }
    let clonedMazeData = [...newMazeData];
    if (
      isTestWin ||
      (rng.nextFloat() < getChancesOfFindingExit() &&
        coveredCells.length >= 0.75 * pathLength) ||
      pathLength - cellsWithItemAmount === 1
    ) {
      handleExitFound(clonedMazeData, newX, newY);
    } else if (
      isTestPlinko ||
      (rng.nextFloat() < chancesOfFinding.plinko &&
        !hasFoundPlinko &&
        remainingTime < 60)
    ) {
      handlePlinkoGameFound(clonedMazeData, newX, newY);
    } else if (!enemyCooldown && rng.nextFloat() < chancesOfFinding.enemy) {
      showFighting(clonedMazeData, newX, newY);
      setTimeout(() => {
        handleEnemyFound(clonedMazeData, newX, newY);
      }, 750);
    } else if (
      !cheeseCooldown &&
      rng.nextFloat() < getChancesOfFindingCheese()
    ) {
      handleCheeseFound(clonedMazeData, newX, newY);
    } else if (!bagCooldown && rng.nextFloat() < chancesOfFinding.bag) {
      handleBagFound(clonedMazeData, newX, newY);
    } else if (isTestCartel || rng.nextFloat() < chancesOfFinding.cartel) {
      handleCartelFound(clonedMazeData, newX, newY);
    } else if (rng.nextFloat() < chancesOfFinding.safe) {
      handleNothingFound(clonedMazeData, newX, newY);
      setScore(score + pointsOfActions.moveWithoutDying);
    } else {
      setScore(score + pointsOfActions.moveWithoutDying);
    }
    setMazeData(clonedMazeData);
  }

  function stopTimer() {
    // clearInterval(timerId);
    setTimerStarted(false);
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const referrerAccount = urlParams.get('referralId') ?? undefined;
    if (referrerAccount) {
      localStorage.setItem('referrer_account', referrerAccount);
    }
  }, []);

  // Function to handle game over
  async function gameOver(message: string, won: boolean) {
    const referralAccount = localStorage.getItem('referrer_account');

    if (referralAccount) {
      localStorage.removeItem('referrer_account');
    }

    if (gameOverRefSent.current) {
      return;
    }

    gameOverRefSent.current = true;

    const cheddarToEarn =
      cheddarFound <= pendingCheddarToMint
        ? cheddarFound
        : pendingCheddarToMint;

    const endGameRequestData = {
      data: {
        cheddarEarned: won ? cheddarToEarn : 0,
        score,
        path: [],
      },
      metadata: {
        blockchain,
        accountId: selectedBlockchainAddress!,
        seedId,
        referralAccount: referralAccount,
      },
    };

    setHasWon(won);
    setCoveredCells([]);
    setGameOverFlag(true);

    const storedGame = localStorage.getItem(
      'stored_cheddar_echosystem_maze_game'
    );
    if (storedGame)
      localStorage.removeItem('stored_cheddar_echosystem_maze_game');

    setTimeout(() => {
      stopTimer();
      setGameOverMessage(message);
      setHasFoundPlinko(false);
    }, 800);

    setCollapsableNavbarActivated(false);

    const endGameResponse = await callEndGame(endGameRequestData).catch(
      (error) => setSaveResponse(error)
    );
    await refetchEarnedButNotMintedCheddar();
    await refetchEarnedAndMintedCheddar();
    setEndGameResponse(endGameResponse);
    if (!endGameResponse.ok) setSaveResponse(endGameResponse.errors);
  }

  function calculateRemainingTime(
    propsTimestampStartStopTimerArray?: number[],
    propsTimestampEndStopTimerArray?: number[],
    propsStartTimestamp?: number | null
  ) {
    return Math.min(
      calculateRemainingTimeInTimeStamp(
        propsTimestampStartStopTimerArray,
        propsTimestampEndStopTimerArray,
        propsStartTimestamp
      ),
      timeLimitInSeconds
    );
  }

  function calculateRemainingTimeInTimeStamp(
    propsTimestampStartStopTimerArray?: number[],
    propsTimestampEndStopTimerArray?: number[],
    propsStartTimestamp?: number | null
  ) {
    let secondsWithTimerStopped = 0;

    const validTimestampStartStopTimerArray =
      propsTimestampStartStopTimerArray ?? timestampStartStopTimerArray;

    const validTimestampEndStopTimerArray =
      propsTimestampEndStopTimerArray ?? timestampEndStopTimerArray;

    const validStartTimestamp = propsStartTimestamp ?? startTimestamp;

    if (
      validTimestampStartStopTimerArray.length > 0 &&
      validTimestampEndStopTimerArray &&
      validTimestampEndStopTimerArray.length > 0
    ) {
      validTimestampStartStopTimerArray.forEach((startTimestamp, index) => {
        secondsWithTimerStopped +=
          (validTimestampEndStopTimerArray[index] - startTimestamp) / 1000;
      });
    }

    // Calculate the remaining time
    const calculatedRemainingTime = Math.floor(
      validStartTimestamp! / 1000 +
        timeLimitInSeconds +
        secondsWithTimerStopped -
        Date.now() / 1000
    );

    return calculatedRemainingTime;
  }

  // Define a new useEffect hook to manage the timer
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (timerStarted && !gameOverFlag && startTimestamp) {
      intervalId = setInterval(() => {
        if (
          // The game is not stopped (Prevent entering this flow when minigame is open)
          timestampStartStopTimerArray.length ===
          timestampEndStopTimerArray.length
        ) {
          setRemainingTime((prevTime) => {
            if (prevTime <= 0 && intervalId) {
              clearInterval(intervalId);
              setStartTimestamp(null);
              setTimestampStartStopTimerArray([]);
              setTimestampEndStopTimerArray([]);
              gameOver("⏰ Time's up! Game Over!", false);
              return 0; // Time's up, return 0
            }

            // Ensure that remainingTime doesn't exceed the timeLimitInSeconds
            return calculateRemainingTime();
          });
        }
      }, 500);
    } else {
      if (intervalId) clearInterval(intervalId);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    }; // Cleanup function to clear interval on unmount or when timer conditions change
  }, [
    timerStarted,
    gameOverFlag,
    timestampStartStopTimerArray,
    timestampEndStopTimerArray,
    startTimestamp,
    timeLimitInSeconds,
  ]);

  function handleMoveByArrow(direction: string) {
    if (gameOverFlag || fightingEnemyFlag) return; // If game over of fight animation is active, prevent further movement

    let newX = playerPosition.x;
    let newY = playerPosition.y;

    switch (direction) {
      case 'ArrowUp':
        newY--;
        setDirection('up');
        break;
      case 'ArrowDown':
        newY++;
        setDirection('down');
        break;
      case 'ArrowLeft':
        newX--;
        setDirection('left');
        break;
      case 'ArrowRight':
        newX++;
        setDirection('right');
        break;
      default:
        return;
    }

    movePlayer(newX, newY);
    // Update last cell coordinates
    setLastCellX(playerPosition.x);
    setLastCellY(playerPosition.y);
  }

  // Function to handle key press events
  function handleKeyPress(event: KeyboardEvent<HTMLDivElement>) {
    const key = event.key;
    handleMoveByArrow(key);
  }

  function handleArrowPress(
    direction: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'
  ) {
    handleMoveByArrow(direction);
  }

  function calculateBlurRadius(cellX: number, cellY: number) {
    return 0;
    // Check if it can be fixed. It looks bad even with maxBlurRadius=1
    // Check if lastCellX and lastCellY are null or undefined
    if (lastCellX === -1 || lastCellY === -1) {
      // Initialize lastCellX and lastCellY with initial player position
      setLastCellX(playerPosition.x);
      setLastCellY(playerPosition.y);
    }

    // Calculate distance between current cell and last cell
    const distance = Math.sqrt(
      Math.pow(cellX - lastCellX, 2) + Math.pow(cellY - lastCellY, 2)
    );

    // Define max blur radius and adjust based on distance
    const maxBlurRadius = 0; // Adjust as needed
    return Math.min(maxBlurRadius, distance);
  }

  function getCoordinatesFromTileId(id: string) {
    if (!id.includes('cell-')) return;

    const stringCoordinates = id.slice('cell-'.length);

    const splitStringCoordinates = stringCoordinates.split('-');

    const finalCoordinate = {
      y: Number(splitStringCoordinates[0]),
      x: Number(splitStringCoordinates[1]),
    };

    return finalCoordinate as Coordinates;
  }

  function isValidTileToMove(coordinates: Coordinates) {
    //If the coordinate is part of the path
    const isPath = mazeData[coordinates.y][coordinates.x].isPath;

    //If the coordinate is next to player location (discarding diagonals)
    const isNextToPlayer =
      ((playerPosition.y + 1 === coordinates.y ||
        playerPosition.y - 1 === coordinates.y) &&
        playerPosition.x === coordinates.x) ||
      ((playerPosition.x + 1 === coordinates.x ||
        playerPosition.x - 1 === coordinates.x) &&
        playerPosition.y === coordinates.y);

    return isPath && isNextToPlayer;
  }

  function moveIfValid(id: string) {
    if (fightingEnemyFlag) return;
    if (id) {
      const touchedCoordinate = getCoordinatesFromTileId(id);

      if (touchedCoordinate && isValidTileToMove(touchedCoordinate)) {
        let newX = playerPosition.x;
        let dX = playerPosition.x - touchedCoordinate.x;

        let newY = playerPosition.y;
        let dY = playerPosition.y - touchedCoordinate.y;

        let newDirection = '' as React.SetStateAction<
          'right' | 'left' | 'down' | 'up'
        >;

        if (dX === 1) {
          newDirection = 'left';
          newX--;
        } else if (dX === -1) {
          newDirection = 'right';
          newX++;
        } else if (dY === 1) {
          newDirection = 'up';
          newY--;
        } else if (dY === -1) {
          newDirection = 'down';
          newY++;
        }

        setDirection(newDirection);

        movePlayer(newX, newY);
        // Update last cell coordinates
        setLastCellX(playerPosition.x);
        setLastCellY(playerPosition.y);
      }

      // setTouchedSquares([id]);
    }
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!showMovementButtons) {
      // event.preventDefault(); // Prevent screen scroll
      const touches = event.touches;
      const initialTouch = touches[0] as Touch;

      const initialSquareId = getSquareIdFromTouch(initialTouch);

      if (!gameOverFlag) moveIfValid(initialSquareId!);
    }
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (!showMovementButtons) {
      event.preventDefault(); // Prevent screen scroll
      const touches = event.touches;

      // Calculate touchedSquares
      for (let i = 0; i < touches.length; i++) {
        const currentTouch = touches[i] as Touch;

        const tileId = getSquareIdFromTouch(currentTouch);

        if (!gameOverFlag && tileId) {
          moveIfValid(tileId);
        }
      }
    }
  };

  const handleOnMouseOver = (event: React.MouseEvent<HTMLDivElement>) => {
    if (isMouseDown) {
      setLastDivId(event.currentTarget.id);
    }
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (showMovementButtons) {
      setIsMouseDown(true);
      setLastDivId(event.currentTarget.id);
    }
  };

  useEffect(() => {
    if (!gameOverFlag && lastDivId) {
      moveIfValid(lastDivId);
    }
  }, [lastDivId]);

  const handleOnMouseUp = () => {
    setIsMouseDown(false);
  };

  const getSquareIdFromTouch = (touch: Touch) => {
    const square = document.elementFromPoint(touch.clientX, touch.clientY);

    return square?.id || '';
  };

  const {
    data: scoreboardResponse,
    isLoading: isLoadingScoreboard,
    error: scoreboardError,
  } = useGetScoreboard();

  const {
    isOpen: plinkoModalOpened,
    onOpen: onOpenPlinkoModal,
    onClose: onClosePlinkoModal,
  } = useDisclosure();

  function openPlinkoModal() {
    onOpenPlinkoModal();
    setHasFoundPlinko(true);
  }

  function closePlinkoModal() {
    const newTimestampEndStopTimer = [
      ...timestampEndStopTimerArray,
      Date.now(),
    ];

    setTimestampEndStopTimerArray(newTimestampEndStopTimer);
    onClosePlinkoModal();
  }
  useEffect(() => {
    if (scoreboardError) {
      handleErrorToast('Error occured while fetching scoreboard!');
    }
  }, [scoreboardError, scoreboardResponse]);

  return (
    <GameContext.Provider
      value={{
        isMobile: isMobile.current,
        mazeData,
        setMazeData,
        playerPosition,
        setPlayerPosition,
        score,
        setScore,
        gameOverFlag,
        setGameOverFlag,
        gameOverMessage,
        setGameOverMessage,
        timerStarted,
        setTimerStarted,
        direction,
        setDirection,
        selectedColorSet,
        setSelectedColorSet,
        lastCellX,
        setLastCellX,
        lastCellY,
        setLastCellY,
        hasPowerUp,
        setHasPowerUp,
        isPowerUpOn,
        setIsPowerUpOn,
        timeLimitInSeconds,
        setTimeLimitInSeconds,
        remainingTime,
        setRemainingTime,
        loadingRemainingMinutesAndSeconds,
        remainingMinutes,
        setRemainingMinutes,
        remainingSeconds,
        setRemainingSeconds,
        cheeseCooldown,
        setCheeseCooldown,
        bagCooldown,
        setBagCooldown,
        enemyCooldown,
        setEnemyCooldown,
        moves,
        setMoves,
        won,
        setWon,
        touchStart,
        setTouchStart,
        touchEnd,
        setTouchEnd,
        coveredCells,
        setCoveredCells,
        mazeRows,
        mazeCols,
        totalCells,
        pathLength: pathLength,
        handleKeyPress,
        handleArrowPress,
        restartGame,
        calculateBlurRadius,
        handleTouchStart,
        handleTouchMove,
        handleMouseDown,
        handleOnMouseOver,
        handleOnMouseUp,
        cheddarFound,
        setCheddarFound,
        saveResponse,
        hasWon,
        pendingCheddarToMint,
        endGameResponse,
        nfts,
        showMovementButtons,
        setShowMovementButtons,
        timestampStartStopTimerArray,
        timestampEndStopTimerArray,
        plinkoModalOpened,
        onOpenPlinkoModal,
        onClosePlinkoModal,
        closePlinkoModal,
        isVideoModalOpened,
        onOpenVideoModal,
        onCloseVideoModal,
        scoreboardResponse,
        isLoadingScoreboard,
        isScoreboardOpen,
        onOpenScoreboard,
        onCloseScoreboard,
        seedId,
        isUserNadabotVerfied,
        isUserHolonymVerified,
        earnedButNotMintedCheddar,
        totalMintedCheddarToDate,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
