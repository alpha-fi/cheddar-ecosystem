import { Gameboard } from './Gameboard';
import { Button, ListItem, OrderedList } from '@chakra-ui/react';
import { MouseEventHandler, useContext, useState } from 'react';

import { GameContext } from '@/contexts/GameContextProvider';
import { BuyNFTCard } from './BuyNFTCard';

import styles from '../styles/GameboardContainer.module.css';

interface Props {
  remainingMinutes: number;
  remainingSeconds: number;
  handlePowerUpClick: MouseEventHandler<HTMLButtonElement>;
  cellSize: number;
}

export function GameboardContainer({
  remainingMinutes,
  remainingSeconds,
  handlePowerUpClick,
  cellSize,
}: Props) {
  const {
    mazeData,
    score,
    gameOverFlag,
    gameOverMessage,
    selectedColorSet,
    hasPowerUp,
    isPowerUpOn,
    handleKeyPress,
    handleTouchMove,
    restartGame,
  } = useContext(GameContext);

  const [showBuyNFTPanel, setShowBuyNFTPanel] = useState(false);

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

  function handleBuyClick() {
    setShowBuyNFTPanel(!showBuyNFTPanel);
  }

  return (
    <div
      className={styles.gameContainer}
      style={{
        maxWidth: `${mazeData[0].length * cellSize + 25}px`,
        backgroundImage: selectedColorSet.backgroundImage,
      }}
    >
      <h1>Cheddar Maze</h1>
      <div className={styles.gameInfo}>
        <div className={styles.score}>Score: {score}</div>
        <div className={styles.time}>
          Time:{' '}
          {remainingMinutes < 10 ? '0' + remainingMinutes : remainingMinutes}:
          {remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}
        </div>
      </div>
      <div className={styles.gameOver}>{gameOverMessage}</div>
      {gameOverFlag && (
        <button onClick={restartGame} className={styles.restartGameButton}>
          Restart Game
        </button>
      )}

      <div
        className={styles.mazeContainer}
        tabIndex={0}
        onKeyDown={handleKeyPress}
        onTouchMove={handleTouchMove}
      >
        <div className={styles.toolbar}>
          <div className={styles.tooltip}>
            <Button
              colorScheme={styles.yellow}
              onClick={handlePowerUpClick}
              disabled={!hasPowerUp}
            >
              ⚡
            </Button>
            <span className={styles.tooltipText}>
              Cheddy PowerUp NFT provides in-game features
            </span>
            {!hasPowerUp && (
              <span className={styles.buyPowerUp}>
                <Button
                  colorScheme={styles.purple}
                  onClick={handleBuyClick}
                  disabled={!hasPowerUp}
                >
                  buy
                </Button>
                {showBuyNFTPanel && (
                  <div className={styles.popup}>
                    {NFTsDataTemplate.map(BuyNFTCard)}
                  </div>
                )}
              </span>
            )}
          </div>
        </div>
        <Gameboard />
      </div>

      <div className={styles.orderedListContainer}>
        <OrderedList>
          <ListItem>Click or Tap to Start</ListItem>
          <ListItem>Navigate with Arrows or Tap</ListItem>
          <ListItem>Collect Cheddar🧀</ListItem>
          <ListItem>Battle Cartel to protect your Bag</ListItem>
          <ListItem>Find the Hidden Door🚪 to Win!</ListItem>
        </OrderedList>
      </div>
    </div>
  );
}
