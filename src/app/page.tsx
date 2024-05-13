'use client';
import Image from 'next/image';
import styles from './page.module.css';
import {
  useEffect,
  useState,
  useContext,
  KeyboardEvent,
  TouchEvent,
} from 'react';
import { GameboardContainer } from '../components/GameboardContainer';

import { GameContext, MazeTileData } from '../contexts/GameContextProvider';
import { Coordinates } from '@/entities/interfaces';

export default function Home() {
  const {
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
    setDirection,
    selectedColorSet,
    setSelectedColorSet,
    lastCellX,
    setLastCellX,
    lastCellY,
    setLastCellY,
    isPowerUpOn,
    setIsPowerUpOn,
    remainingTime,
    setRemainingTime,
    setTimeLimitInSeconds,
    setRemainingMinutes,
    setRemainingSeconds,
    cheeseCooldown,
    setCheeseCooldown,
    enemyCooldown,
    moves,
    setMoves,
    setWon,
    touchStart,
    coveredCells,
    setCoveredCells,
  } = useContext(GameContext);

  // const [playerStartY, setPlayerStartY] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [rarity, setRarity] = useState('');

  const mazeRows = 11;
  const mazeCols = 9;
  const totalCells = mazeRows * mazeCols;

  function handlePowerUpClick() {
    setIsPowerUpOn(!isPowerUpOn);
    // Additional logic if needed
  }

  function handleBuyClick() {
    const popup = document.getElementById('buyPopup');
    if (popup!.style.display === 'block') {
      popup!.style.display = 'none';
    } else {
      popup!.style.display = 'block';
    }
  }

  // Function to select a random color set, background image, and rarity
  const selectRandomColorSet = () => {
    const colorSets = [
      {
        backgroundColor: '#333333',
        pathColor: '#9d67ef',
        nonPathColor: 'white',
        textColor: '#000000',
        rarity: 'common',
        backgroundImage:
          "url('https://cheddar.farm/newFarmBackground.c6905a5e.png')",
      },
      {
        backgroundColor: '#333333',
        pathColor: 'gold',
        nonPathColor: 'white',
        textColor: '#333333',
        rarity: 'rare',
        backgroundImage:
          "url('https://ipfs.near.social/ipfs/bafkreihpddbzbioe7kctes25rr52klcs5we4pocwiwbmwldqf4acdarpcm')",
      },
      {
        backgroundColor: '#20d3fc',
        pathColor: '#ff00ff',
        nonPathColor: '#6600ff',
        textColor: '#333333',
        rarity: 'rare',
        backgroundImage:
          "url('https://ipfs.near.social/ipfs/bafkreihpddbzbioe7kctes25rr52klcs5we4pocwiwbmwldqf4acdarpcm')",
      },
      // Add more color sets as needed
    ];

    return colorSets[Math.floor(Math.random() * colorSets.length)];
  };

  // Define a new useEffect hook to manage the timer
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (timerStarted && !gameOverFlag) {
      intervalId = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime === 0 && intervalId) {
            clearInterval(intervalId);
            gameOver("⏰ Time's up! Game Over!");
            return prevTime;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalId) clearInterval(intervalId);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    }; // Cleanup function to clear interval on unmount or when timer conditions change
  }, [timerStarted, gameOverFlag]);

  useEffect(() => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    setRemainingMinutes(minutes);
    setRemainingSeconds(seconds);
  }, [remainingTime]);

  // useEffect(() => {
  //   // Clear timer when component unmounts
  //   return () => {
  //     clearInterval(timerId);
  //   };
  // }, [timerId]);

  function getRandomPathCell(mazeData: MazeTileData[][]) {
    const pathCells: Coordinates[] = [];
    mazeData.map((row: MazeTileData[], rowIndex: number) => {
      row.map((cell: MazeTileData, colIndex: number) => {
        if (cell.isPath) {
          pathCells.push({ x: colIndex, y: rowIndex });
        }
      });
    });

    return pathCells[Math.floor(Math.random() * pathCells.length)];
  }

  // Function to restart the game
  function restartGame() {
    // clearInterval(timerId);
    setScore(0);
    setTimeLimitInSeconds(120);
    setRemainingTime(120);
    setCheeseCooldown(false);
    // setEnemyCooldown(false);
    setMoves(0);
    setGameOverFlag(false);
    setWon(false);
    setGameOverMessage('');
    setDirection('right');

    // Regenerate maze data
    const newMazeData = generateMazeData(mazeRows, mazeCols);

    // Set the maze data with the new maze and player's starting position
    setMazeData(newMazeData);

    const playerStartCell = getRandomPathCell(newMazeData);
    console.log(playerStartCell.x + ' ' + playerStartCell.y);
    setPlayerPosition({ x: playerStartCell.x, y: playerStartCell.y });
    setLastCellX(-1);
    setLastCellY(-1);

    startTimer(); // Start the timer again after resetting the game
  }

  // Function to generate maze data
  function generateMazeData(rows: number, cols: number) {
    const maze = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({
        isPath: false,
        isActive: false,
        hasCheese: false,
        hasEnemy: false,
        hasExit: false,
        enemyWon: false,
        hasCartel: false,
      }))
    );

    // Choose a random starting position on the outer border
    const startEdge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let x: number, y: number;

    switch (startEdge) {
      case 0: // Top edge
        x = Math.floor(Math.random() * (cols - 2)) + 1;
        y = 0;
        break;
      case 1: // Right edge
        x = cols - 1;
        y = Math.floor(Math.random() * (rows - 2)) + 1;
        break;
      case 2: // Bottom edge
        x = Math.floor(Math.random() * (cols - 2)) + 1;
        y = rows - 1;
        break;
      case 3: // Left edge
        x = 0;
        y = Math.floor(Math.random() * (rows - 2)) + 1;
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
          directions[Math.floor(Math.random() * directions.length)];
        maze[ny][nx].isPath = true;
        maze[py][px].isPath = true;
        stack.push([nx, ny]);
      } else {
        stack.pop();
      }
    }

    return maze;
  }

  // Inside the component where you're using the Maze component
  useEffect(() => {
    // Generate maze data and set it to the state
    const newMazeData = generateMazeData(mazeRows, mazeCols);
    setMazeData(newMazeData);

    const randomColorSet = selectRandomColorSet();
    setSelectedColorSet(randomColorSet);
    setBackgroundImage(randomColorSet.backgroundImage);
    setRarity(randomColorSet.rarity);

    const playerStartCell = getRandomPathCell(newMazeData);
    setPlayerPosition({ x: playerStartCell.x, y: playerStartCell.y });
  }, []); // Empty dependency array to run this effect only once on component mount

  function movePlayer(newX: number, newY: number) {
    if (
      !mazeData[newY] ||
      !mazeData[newY][newX] ||
      !mazeData[newY][newX].isPath
    ) {
      return; // Player cannot move to non-path cells
    }

    // Start the timer if it hasn't started yet
    if (!timerStarted) {
      startTimer();
      setTimerStarted(true);
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
    setCoveredCells(coveredCells + 1);

    // Periodically add artifacts to the board based on cooldowns and randomness
    addArtifacts(newX, newY, newMazeData, moves);

    // Set lastCellX and lastCellY to the new player position
    // Update last cell coordinates
    setLastCellX(playerPosition.x);
    setLastCellY(playerPosition.y);
  }

  function doesCellHasArtifact(x: number, y: number) {
    return (
      mazeData[y][x].hasCheese ||
      mazeData[y][x].hasEnemy ||
      mazeData[y][x].hasCartel ||
      mazeData[y][x].hasExit
    );
  }

  function handleEnemyFound(
    clonedMazeData: MazeTileData[][],
    x: number,
    y: number
  ) {
    // 30% chance of encountering an enemy
    // Code for adding enemy artifact...

    // Add logic for the enemy defeating the player
    if (Math.random() < 0) {
      // 0% chance of the enemy winning
      console.log('enemy won');
      clonedMazeData[y][x].enemyWon = true;
      clonedMazeData[y][x].isActive = false;

      setScore(0); // Set score to zero
      gameOver('Enemy won! Game Over!');
    } else {
      clonedMazeData[y][x].hasEnemy = true;

      // setEnemyCooldown(true);
      setTimeout(
        () => {
          // setEnemyCooldown(false);
        },
        Math.floor(Math.random() * 5000) + 1000
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

    setScore(score + 1);
    setCheeseCooldown(true);
    setTimeout(
      () => {
        setCheeseCooldown(false);
      },
      Math.floor(Math.random() * 5000) + 1000
    );
  }

  function handleCartelFound(
    clonedMazeData: MazeTileData[][],
    x: number,
    y: number
  ) {
    // 0.2% chance of hitting the "cartel" event
    clonedMazeData[y][x].hasCartel = true;

    setScore(0);
    gameOver('You ran into the cartel! Game Over!');
  }

  function handleExitFound(
    clonedMazeData: MazeTileData[][],
    x: number,
    y: number
  ) {
    clonedMazeData[y][x].hasExit = true;
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
    if (newMazeData[newY][newX].hasExit) {
      gameOver('Congrats! You found the Hidden Door.');
      return;
    }
    if (doesCellHasArtifact(newX, newY)) {
      return;
    }

    let clonedMazeData = [...newMazeData];
    if (!enemyCooldown && Math.random() < 0.3) {
      handleEnemyFound(clonedMazeData, newX, newY);
    } else if (!cheeseCooldown && Math.random() < 0.055) {
      handleCheeseFound(clonedMazeData, newX, newY);
    } else if (Math.random() < 0.002) {
      handleCartelFound(clonedMazeData, newX, newY);
    } else if (Math.random() < 0.33 && coveredCells >= 0.75 * totalCells) {
      handleExitFound(clonedMazeData, newX, newY);
    }
    setMazeData(clonedMazeData);
  }

  // Function to handle key press events
  function handleKeyPress(event: KeyboardEvent) {
    if (gameOverFlag) return; // If game over, prevent further movement

    const key = event.key;
    let newX = playerPosition.x;
    let newY = playerPosition.y;

    switch (key) {
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

  function isMobile() {
    const userAgent = navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );
  }

  const cellSize = isMobile() ? 30 : 40;

  function handleContainerClick() {
    startTimerOnTap(); // Start the timer when the user clicks on the maze container
  }

  let isMouseDown = false;

  // const handleMouseClick = (event: MouseEvent) => {
  //   if (gameOverFlag) return; // If game over, prevent further movement

  //   // Extract cell coordinates from the id attribute
  //   const id = event.target.id;
  //   const [_, y, x] = id.split('-');
  //   const newX = parseInt(x);
  //   const newY = parseInt(y);

  //   // Calculate the direction based on the clicked cell's position relative to the player's current position
  //   let newDirection = direction; // Initialize newDirection with the current direction
  //   if (newY < playerPosition.y) {
  //     newDirection = 'up';
  //   } else if (newY > playerPosition.y) {
  //     newDirection = 'down';
  //   } else if (newX < playerPosition.x) {
  //     newDirection = 'left';
  //   } else if (newX > playerPosition.x) {
  //     newDirection = 'right';
  //   }

  //   // Update the direction state
  //   setDirection(newDirection);

  //   // Call movePlayer to move the player to the clicked cell
  //   movePlayer(newX, newY);
  // };

  // Function to calculate the path from the current position to the target position
  // const calculatePath = (
  //   currentX: number,
  //   currentY: number,
  //   targetX: number,
  //   targetY: number
  // ) => {
  //   console.log(
  //     `Calculating path from (${currentX}, ${currentY}) to (${targetX}, ${targetY})`
  //   );
  //   const path = [];

  //   let deltaX = Math.sign(targetX - currentX);
  //   let deltaY = Math.sign(targetY - currentY);

  //   let x = currentX;
  //   let y = currentY;

  //   console.log('Delta X:', deltaX);
  //   console.log('Delta Y:', deltaY);

  //   // Ensure that both x and y are not equal to their respective target values
  //   while (x !== targetX || y !== targetY) {
  //     path.push([x, y]);

  //     // Move along the x-axis towards the target
  //     if (x !== targetX) x += deltaX;

  //     // Move along the y-axis towards the target
  //     if (y !== targetY) y += deltaY;
  //   }

  //   // Add the target position to the path
  //   path.push([targetX, targetY]);

  //   console.log('Calculated path:', path);

  //   return path;
  // };

  // Function to move the player along the calculated path
  // const moveAlongPath = (path: any) => {
  //   console.log('Moving along path:', path);
  //   path.forEach(([x, y]: number[]) => {
  //     console.log(`Moving to cell (${x}, ${y})`);
  //     movePlayer(x, y);
  //   });
  // };

  // Function to extract cell coordinates from the id attribute
  function getCellCoordinates(id: string) {
    const [_, y, x] = id.split('-');
    return { newX: parseInt(x), newY: parseInt(y) };
  }

  function handleTouchMove(event: TouchEvent) {
    event.preventDefault(); // Prevent default touch move behavior

    if (/*!mazeContainerRef ||*/ !isMouseDown) return;

    const inputTarget = event.target as HTMLElement;

    const { newX, newY } = getCellCoordinates(inputTarget.id);

    // Update last cell coordinates
    setLastCellX(playerPosition.x);
    setLastCellY(playerPosition.y);

    // Call movePlayerDirection to move the player based on touch direction
    const deltaX = newX - touchStart.x;
    const deltaY = newY - touchStart.y;
    let direction = '';

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }

    // Move the player in the determined direction
    // for (let i = 0; i < Math.abs(cellsMovedX); i++) {
    //   movePlayerDirection(direction);
    // }

    // for (let i = 0; i < Math.abs(cellsMovedY); i++) {
    //   movePlayerDirection(direction);
    // }

    // Update touch start position for next move
    // setTouchStart({ x: touch.clientX, y: touch.clientY });
  }

  function calculateBlurRadius(cellX: number, cellY: number) {
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
    const maxBlurRadius = 10; // Adjust as needed
    return Math.min(maxBlurRadius, distance);
  }

  // const ControlPad = ({ movePlayerDirection }) => {
  //   return (
  //     <div
  //       style={{
  //         display: 'flex',
  //         flexDirection: 'column',
  //         alignItems: 'center',
  //       }}
  //     >
  //       <button onClick={() => movePlayerDirection('up')}>Up</button>
  //       <div style={{ display: 'flex', justifyContent: 'center' }}>
  //         <button onClick={() => movePlayerDirection('left')}>Left</button>
  //         <button onClick={() => movePlayerDirection('down')}>Down</button>
  //         <button onClick={() => movePlayerDirection('right')}>Right</button>
  //       </div>
  //     </div>
  //   );
  // };

  // Function to handle directional button inputs
  // const movePlayerDirection = (direction) => {
  //   if (gameOverFlag) return;

  //   let newX = playerPosition.x;
  //   let newY = playerPosition.y;

  //   switch (direction) {
  //     case 'up':
  //       newY--;
  //       break;
  //     case 'down':
  //       newY++;
  //       break;
  //     case 'left':
  //       newX--;
  //       break;
  //     case 'right':
  //       newX++;
  //       break;
  //     default:
  //       return;
  //   }

  //   setDirection(direction); // Optionally update the direction if needed
  //   handleMove(newX, newY);
  // };

  // Example handler for touch or click events where path calculation is desired
  // const handleMove = (event) => {
  //   const { newX, newY } = getCellCoordinates(event.target.id);
  //   const path = calculatePath(playerPosition.x, playerPosition.y, newX, newY);
  //   moveAlongPath(path);
  // };

  // Function to start the timer
  function startTimer() {
    if (!timerStarted && !gameOverFlag) {
      setTimerStarted(true);
    }
  }

  function startTimerOnTap() {
    if (!timerStarted) {
      startTimer();
    }
  }

  function stopTimer() {
    // clearInterval(timerId);
    setTimerStarted(false);
  }

  // Function to handle game over
  function gameOver(message: string) {
    setGameOverFlag(true);
    setGameOverMessage(message);
    stopTimer();
  }

  function initialized() {
    // Check if all necessary state variables are not null or undefined
    return (
      selectedColorSet !== null &&
      mazeData !== null &&
      Array.isArray(mazeData) &&
      mazeData[0] !== undefined &&
      playerPosition !== null &&
      score !== null &&
      remainingTime !== null &&
      gameOverFlag !== null &&
      gameOverMessage !== null &&
      startTimer !== null &&
      handleKeyPress !== null &&
      handleTouchMove !== null &&
      // handleMouseClick !== null &&
      restartGame !== null
    );
  }

  return (
    <div>
      {initialized() && ( // Replace `condition` with your actual condition
        <GameboardContainer
          // mazeData={mazeData}
          // playerPosition={playerPosition}
          // score={score}
          // timerStarted={false}
          remainingMinutes={Math.floor(remainingTime / 60)}
          remainingSeconds={remainingTime % 60}
          startTimerOnTap={startTimer}
          handleKeyPress={handleKeyPress}
          handleTouchMove={handleTouchMove}
          // handleMouseClick={handleMouseClick}
          restartGame={restartGame}
          // hasExit={hasExit}
          handlePowerUpClick={handlePowerUpClick}
          handleBuyClick={handleBuyClick}
          cellSize={cellSize}
          calculateBlurRadius={calculateBlurRadius}
        />
      )}
    </div>
  );
}
