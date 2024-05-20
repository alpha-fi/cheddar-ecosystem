import { MazeTileData } from '@/contexts/GameContextProvider';
import { useContext } from 'react';
import { GameContext } from '@/contexts/GameContextProvider';
import { ListItem, OrderedList } from '@chakra-ui/react';

import styles from '../styles/Gameboard.module.css';

interface Props {
  showRules: boolean;
}

export function Gameboard({ showRules }: Props) {
  const {
    mazeData,
    playerPosition,
    direction,
    selectedColorSet,
    lastCellX,
    setLastCellX,
    lastCellY,
    setLastCellY,
    calculateBlurRadius,
    handleTouchStart,
    handleTouchMove,
  } = useContext(GameContext);

  // Check if the game has started for the first time
  const gameStarted = playerPosition !== null;

  // Check if the player position has changed
  const playerMoved =
    gameStarted &&
    (lastCellX !== playerPosition.x || lastCellY !== playerPosition.y);

  // Update last player position
  setLastCellX(playerPosition!.x);
  setLastCellY(playerPosition!.y);

  function getPlayerImgDirection() {
    return styles[
      `playerMove${direction.charAt(0).toUpperCase() + direction.slice(1)}`
    ];
  }

  return (
    <>
      {showRules && (
        <div className={styles.orderedListContainer}>
          <OrderedList>
            <ListItem>Click or Tap to Start</ListItem>
            <ListItem>Navigate with Arrows or Tap</ListItem>
            <ListItem>Collect Cheddar🧀</ListItem>
            <ListItem>Battle Cartel to protect your Bag</ListItem>
            <ListItem>Find the Hidden Door🚪 to Win!</ListItem>
          </OrderedList>
        </div>
      )}
      {mazeData.map((row: MazeTileData[], rowIndex: number) => (
        <div key={rowIndex} className={styles.mazeRow}>
          {row.map((cell: MazeTileData, colIndex: number) => {
            const blurRadius = playerMoved
              ? calculateBlurRadius(colIndex, rowIndex)
              : 0;
            const applyBlur = blurRadius > 0; // Determine if blur should be applied

            // Define cell content based on cell type
            let cellContent = '';
            if (cell.hasCheese) cellContent = '🧀';
            else if (cell.hasEnemy) cellContent = '👾';
            else if (cell.hasExit) cellContent = '🚪';
            else if (cell.hasCartel) cellContent = '🤮';
            else if (cell.enemyWon) cellContent = '💢';

            return (
              <div
                key={colIndex}
                id={`cell-${rowIndex}-${colIndex}`}
                className={styles.mazeCell}
                style={{
                  border: `1px solid ${selectedColorSet.nonPathColor}`,
                  backgroundColor: cell.isPath
                    ? selectedColorSet.pathColor
                    : selectedColorSet.backgroundColor,
                  filter: applyBlur ? `blur(${blurRadius}px)` : 'none', // Apply blur conditionally
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
              >
                {/* Dynamic content based on cell */}
                {cellContent && (
                  <span
                    role="img"
                    aria-label={cellContent}
                    // className="static-icon"
                    className={styles.staticIcon}
                  >
                    {cellContent}
                  </span>
                )}

                {/* Player icon */}
                {playerPosition!.x === colIndex &&
                  playerPosition!.y === rowIndex && (
                    <div
                      className={`
                ${styles.mazeCell} ${styles.playerCell} ${getPlayerImgDirection()}
                `}
                      // ${/*styles[direction]*/}
                      style={{
                        backgroundImage:
                          cell.enemyWon || cell.hasCartel || cell.hasExit
                            ? 'none'
                            : "url('https://lh3.googleusercontent.com/d/114_RLl18MAzX035svMyvNJpE3ArfLNCF=w500')",
                      }}
                    ></div>
                  )}
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}
