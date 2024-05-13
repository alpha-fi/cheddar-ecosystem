import { Gameboard } from './Gameboard';
import { Button } from '@chakra-ui/react';
import {
  KeyboardEvent,
  KeyboardEventHandler,
  MouseEventHandler,
  TouchEvent,
  TouchEventHandler,
  useContext,
} from 'react';

import { GameContext, MazeTileData } from '@/contexts/GameContextProvider';
import { Coordinates } from '@/entities/interfaces';
import { BuyNFTCard } from './BuyNFTCard';
import { maxHeaderSize } from 'http';

interface Props {
  remainingMinutes: number;
  remainingSeconds: number;
  handlePowerUpClick: MouseEventHandler<HTMLButtonElement>;
  handleBuyClick: MouseEventHandler<HTMLButtonElement>;
  cellSize: number;
  // startTimerOnTap: () => void;
  // handleKeyPress: (e: KeyboardEvent) => void;
  // handleTouchMove: (e: TouchEvent) => void;
  // restartGame: () => void;
  // calculateBlurRadius: (cellX: number, cellY: number) => number;
}

export function GameboardContainer({
  remainingMinutes,
  remainingSeconds,
  // startTimerOnTap,
  // handleKeyPress,
  // handleTouchMove,
  // restartGame,
  // calculateBlurRadius,
  // handleMouseClick,
  // hasExit,
  handlePowerUpClick,
  handleBuyClick,
  cellSize,
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
    handleKeyPress,
    handleTouchMove,
    restartGame,
    calculateBlurRadius,
  } = useContext(GameContext);

  //TODO get actual data and modify it as needed
  const NFTsDataTemplate = [
    {
      imgSrc:
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
      price: 0.9,
      name: 'CHEDDY 1',
      id: 9999999,
    },
    {
      imgSrc:
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
      price: 0.8,
      name: 'CHEDDY 2',
      id: 9999998,
    },
    {
      imgSrc:
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
      price: 3,
      name: 'CHEDDY 3',
      id: 9999997,
    },
    {
      imgSrc:
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
      price: 0.9,
      name: 'CHEDDY 4',
      id: 9999996,
    },
  ];

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
      display: 'flex',
      textAlign: 'right',
      alignItems: 'right',
      padding: '5px',
      gap: '5px',
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
      zIndex: '3',
      borderRadius: '5px',
      display: 'none',
      right: '5px',
      minWidth: '300px',
      overflowY: 'scroll',
      maxHeight: '400px',
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
            <Button
              colorScheme="yellow"
              onClick={handlePowerUpClick}
              disabled={!hasPowerUp}
            >
              ⚡
            </Button>
            <span style={styles.tooltipText}>
              Cheddy PowerUp NFT provides in-game features
            </span>
            {!hasPowerUp && (
              <span style={styles.buyPowerUp}>
                <Button
                  colorScheme="purple"
                  onClick={handleBuyClick}
                  disabled={!hasPowerUp}
                >
                  buy
                </Button>
                <div id="buyPopup" style={styles.popup}>
                  {NFTsDataTemplate.map(BuyNFTCard)}
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
