import { Gameboard } from './Gameboard';
import {
  KeyboardEvent,
  MouseEventHandler,
  TouchEvent,
  TouchEventHandler,
  useContext,
} from 'react';

import { GameContext, MazeTileData } from '@/contexts/GameContextProvider';
import { Coordinates } from '@/entities/interfaces';

interface Props {
  remainingMinutes: number;
  remainingSeconds: number;
  startTimerOnTap: () => void;
  handleKeyPress: (e: KeyboardEvent) => void;
  handleTouchMove: (e: TouchEvent) => void;
  restartGame: () => void;
  handlePowerUpClick: MouseEventHandler<HTMLButtonElement>;
  handleBuyClick: MouseEventHandler<HTMLAnchorElement>;
  cellSize: number;
  calculateBlurRadius: (cellX: number, cellY: number) => number;
}

export function GameboardContainer({
  remainingMinutes,
  remainingSeconds,
  startTimerOnTap,
  handleKeyPress,
  handleTouchMove,
  // handleMouseClick,
  restartGame,
  // hasExit,
  handlePowerUpClick,
  handleBuyClick,
  cellSize,
  calculateBlurRadius,
}: Props) {
  const {
    timerStarted,
    mazeData,
    playerPosition,
    score,
    gameOverFlag,
    gameOverMessage,
    direction,
    selectedColorSet,
    lastCellX,
    setLastCellX,
    lastCellY,
    setLastCellY,
    hasPowerUp,
    isPowerUpOn,
  } = useContext(GameContext);

  const styles: Record<string, any> = {
    gameContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: '0 auto',
      padding: '0',
      maxWidth: `${mazeData[0].length * cellSize + 25}px`,
      border: '1px solid gold',
      fontFamily: 'Bubblegum Sans !important', // Add font-family
      backgroundImage: selectedColorSet.backgroundImage,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    mazeContainer: {
      marginBottom: '10px',
      borderRadius: '5px',
      overflow: 'hidden',
      width: 'fit-content',
      border: `3px solid #8542eb`,
    },
    mazeRow: {
      display: 'flex',
    },
    mazeCell: {
      display: 'flex',
      flex: '0 0 auto', // Fix the size of the cell
      width: '40px',
      height: '40px',
      border: `1px solid ${selectedColorSet.nonPathColor}`,
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '24px', // Adjust the font size of the emojis
      padding: '5px', // Add padding for better visual appearance
    },
    playerCell: {
      position: 'relative', // Ensure the player is positioned relative to its parent
      width: '40px',
      height: '40px',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '24px',
      backgroundColor: 'transparent',
    },
    playerMoveUp: {
      transform: 'rotate(-90deg)',
    },
    playerMoveDown: {
      transform: 'rotate(90deg)',
    },
    playerMoveLeft: {
      transform: 'scaleX(-1)',
    },
    playerMoveRight: {
      transform: '',
    },
    playerActive: {
      zIndex: 1, // Ensure the active player appears above other elements
    },
    debugInfo: {
      display: 'none', // Hide debug info by default
    },
    gameOver: {
      fontSize: '15px',
      fontWeight: 'bold',
      // color: hasExit ? 'green' : 'red',
      color: true ? 'green' : 'red',
    },
    gameInfo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center', // Align items in the center
      width: '100%', // Adjust the width as needed
      margin: 'auto', // Center the game info horizontally
      marginBottom: '10px',
    },
    score: {
      // Styles for the score
      flex: '1', // Allow the score to take up remaining space
      textAlign: 'center', // Center align the score
    },
    toolbar: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      justifyItems: 'end',
      backgroundColor: '#8542eb',
    },
    tooltip: {
      position: 'relative',
      display: 'inline-block',
      textAlign: 'right',
      alignItems: 'right',
      padding: '5px',
    },
    powerUpButton: {
      backgroundColor: isPowerUpOn ? '#007bff' : '#AAB8C2',
      color: '#ffffff', // Button text color
      border: 'none',
      borderRadius: '5px',
      padding: '5px 10px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    tooltipText: {
      visibility: 'hidden',
      width: '120px',
      backgroundColor: '#555',
      color: '#fff',
      textAlign: 'center',
      borderRadius: '6px',
      padding: '5px',
      position: 'absolute',
      zIndex: '1',
      bottom: '125%',
      left: '50%',
      marginLeft: '-60px',
      opacity: '0',
      transition: 'opacity 0.3s',
    },
    time: {
      flex: '1', // Allow time to take up remaining space
      textAlign: 'center', // Center align the time
    },
    buyPowerUp: {
      flex: '1', // Allow time to take up remaining space
      textAlign: 'center', // Center align the time
    },
    buyLink: {
      color: 'yellow',
      textDecoration: 'none',
    },
    popup: {
      position: 'absolute',
      backgroundColor: '#f9f9f9',
      border: '1px solid #ccc',
      padding: '10px',
      zIndex: '1',
      borderRadius: '5px',
      display: 'none',
    },
  };

  return (
    <div style={styles.gameContainer}>
      <h1>Cheddar Maze</h1>
      <div style={styles.gameInfo}>
        <div style={styles.score}>Score: {score}</div>
        <div style={styles.time}>
          Time:{' '}
          {remainingMinutes < 10 ? '0' + remainingMinutes : remainingMinutes}:
          {remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}
        </div>
      </div>
      <div style={styles.gameOver}>{gameOverMessage}</div>
      {gameOverFlag && (
        <button onClick={restartGame} style={{ fontSize: '18px' }}>
          Restart Game
        </button>
      )}

      <div
        style={styles.mazeContainer}
        tabIndex={0}
        onKeyDown={handleKeyPress}
        onTouchMove={handleTouchMove}
        // onClick={handleMouseClick}
      >
        <div style={styles.toolbar}>
          <div style={styles.tooltip}>
            <button
              style={styles.powerUpButton}
              onClick={handlePowerUpClick}
              disabled={!hasPowerUp}
            >
              ⚡
            </button>
            <span style={styles.tooltipText}>
              Cheddy PowerUp NFT provides in-game features
            </span>
            {!hasPowerUp && (
              <span style={styles.buyPowerUp}>
                <a href="#" style={styles.buyLink} onClick={handleBuyClick}>
                  buy
                </a>
                <div id="buyPopup" style={styles.popup}>
                  This is the popup content.
                </div>
              </span>
            )}
          </div>
        </div>
        <Gameboard
          playerPosition={playerPosition}
          lastCellX={lastCellX}
          lastCellY={lastCellY}
          mazeData={mazeData}
          styles={styles}
          calculateBlurRadius={calculateBlurRadius}
          selectedColorSet={selectedColorSet}
          direction={direction}
          setLastCellX={setLastCellX}
          setLastCellY={setLastCellY}
        />
      </div>

      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '10px',
        }}
      >
        <ol>
          <li>Click or Tap to Start</li>
          <li>Navigate with Arrows or Tap</li>
          <li>Collect Cheddar🧀</li>
          <li>Battle Cartel to protect your Bag</li>
          <li>Find the Hidden Door🚪 to Win!</li>
        </ol>
      </div>
    </div>
  );
}
