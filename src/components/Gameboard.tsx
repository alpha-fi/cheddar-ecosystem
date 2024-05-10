import { MazeTileData } from '@/contexts/GameContextProvider';
import { Coordinates } from '@/entities/interfaces';

interface Props {
  playerPosition: Coordinates | null;
  lastCellX: number;
  lastCellY: number;
  mazeData: MazeTileData[][];
  styles: Record<string, any>;
  calculateBlurRadius: (cellX: number, cellY: number) => number;
  selectedColorSet: {
    backgroundColor: string;
    pathColor: string;
    nonPathColor: string;
    textColor: string;
    rarity: string;
    backgroundImage: string;
  };
  direction: 'right' | 'left' | 'down' | 'up';
  setLastCellX: Function;
  setLastCellY: Function;
}

export function Gameboard({
  playerPosition,
  lastCellX,
  lastCellY,
  mazeData,
  styles,
  calculateBlurRadius,
  selectedColorSet,
  direction,
  setLastCellX,
  setLastCellY,
}: Props) {
  // Check if the game has started for the first time
  const gameStarted = playerPosition !== null;

  // Check if the player position has changed
  const playerMoved =
    gameStarted &&
    (lastCellX !== playerPosition.x || lastCellY !== playerPosition.y);

  // Update last player position
  setLastCellX(playerPosition!.x);
  setLastCellY(playerPosition!.y);

  return mazeData.map((row: MazeTileData[], rowIndex: number) => (
    <div key={rowIndex} style={styles.mazeRow}>
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
            style={{
              ...styles.mazeCell,
              backgroundColor: cell.isPath
                ? selectedColorSet.pathColor
                : selectedColorSet.backgroundColor,
              filter: applyBlur ? `blur(${blurRadius}px)` : 'none', // Apply blur conditionally
              position: 'relative', // Ensure relative positioning for absolute positioning of icons
            }}
            // onClick={handleMouseClick}
          >
            {/* Dynamic content based on cell */}
            {cellContent && (
              <span
                role="img"
                aria-label={cellContent}
                className="static-icon"
                style={{ position: 'absolute' }}
              >
                {cellContent}
              </span>
            )}

            {/* Player icon */}
            {playerPosition!.x === colIndex &&
              playerPosition!.y === rowIndex && (
                <div
                  className={`player-icon ${direction}`} // Apply dynamic CSS class based on the direction
                  style={{
                    ...styles.mazeCell,
                    ...styles.playerCell,
                    ...styles[
                      `playerMove${
                        direction.charAt(0).toUpperCase() + direction.slice(1)
                      }`
                    ], // Applying the direction style dynamically
                    // backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundSize: '70%',
                    position: 'relative',
                    zIndex: '2', // Ensure player is in the forefront
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
  ));
}
