import { MazeTileData } from '@/contexts/GameContextProvider';
import { useContext } from 'react';
import { GameContext } from '@/contexts/GameContextProvider';

interface Props {
  styles: Record<string, any>;
  isUserLoggedIn: boolean;
  openLogIn: () => void;
}

export function Gameboard({ styles, isUserLoggedIn, openLogIn }: Props) {
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

  const handleConditionalFunction =
    (onTrue: (event: any) => void, onFalse: () => void) => (event: any) => {
      if (isUserLoggedIn) {
        onTrue(event);
      } else {
        onFalse();
      }
    };

  return mazeData.map((row: MazeTileData[], rowIndex: number) => {
    return (
      <div key={rowIndex} style={styles.mazeRow}>
        {row.map((cell: MazeTileData, colIndex: number) => {
          const matchTileWithPlayerUbication =
            playerPosition!.x === colIndex && playerPosition!.y === rowIndex;
          const blurRadius = playerMoved
            ? calculateBlurRadius(colIndex, rowIndex)
            : 0;
          const applyBlur = blurRadius > 0; // Determine if blur should be applied

        // Define cell content based on cell type
        let cellContent = '';

        //TODO choose best logos options

        //====================================================== Start cheese logo options ======================================================
        if (cell.hasCheese) cellContent = '🧀';
        //====================================================== end cheese logo options ======================================================

        //====================================================== Start bag logo options ======================================================
        // else if(cell.hasBag) cellContent = '🤑';
        // else if(cell.hasBag) cellContent = '👑';
        // else if(cell.hasBag) cellContent = '💎';
        else if(cell.hasBag) cellContent = '💰';
        //====================================================== End bag logo options ======================================================


        //====================================================== Start enemy logo options ======================================================
        // else if (cell.hasEnemy) cellContent = '👾';
        // else if (cell.hasEnemy) cellContent = '👹';
        // else if (cell.hasEnemy) cellContent = '🤕';
        // else if (cell.hasEnemy) cellContent = '🤺';
        // else if (cell.hasEnemy) cellContent = '🦹‍♂️';
        // else if (cell.hasEnemy) cellContent = '🧌';
        // else if (cell.hasEnemy) cellContent = '🧙‍♂️';
        // else if (cell.hasEnemy) cellContent = '🤖';
        // else if (cell.hasEnemy) cellContent = '👽';
        // else if (cell.hasEnemy) cellContent = '👺';
        // else if (cell.hasEnemy) cellContent = '😈';
        // else if (cell.hasEnemy) cellContent = '🐉';
        else if (cell.hasEnemy) cellContent = '⚔️';
        //====================================================== End enemy logo options ======================================================


        //====================================================== Start exit logo options ======================================================
        else if (cell.hasExit) cellContent = '🚪';
        //====================================================== End exit logo options ======================================================
        
        
        //====================================================== Start cartel logo options ======================================================
        // else if (cell.hasCartel) cellContent = '👾';
        // else if (cell.hasCartel) cellContent = '🤮';
        // else if (cell.hasCartel) cellContent = '🤕';
        // else if (cell.hasCartel) cellContent = '💣';
        // else if (cell.hasCartel) cellContent = '💥';
        // else if (cell.hasCartel) cellContent = '🤺';
        // else if (cell.hasCartel) cellContent = '🧌';
        // else if (cell.hasCartel) cellContent = '🧙‍♂️';
        // else if (cell.hasCartel) cellContent = '🤖';
        // else if (cell.hasCartel) cellContent = '👽';
        // else if (cell.hasCartel) cellContent = '👺';
        // else if (cell.hasCartel) cellContent = '🦹‍♂️';
        // else if (cell.hasCartel) cellContent = '🐉';
        else if (cell.hasCartel) cellContent = '😈';
        //====================================================== End cartel logo options ======================================================
        
        
        //====================================================== Start enemy won logo options ======================================================
        // else if (cell.enemyWon) cellContent = '💢';
        // else if (cell.enemyWon) cellContent = '😵';
        // else if (cell.enemyWon) cellContent = '☠️';
        else if (cell.enemyWon) cellContent = '💀';
        //====================================================== End enemy won logo options ======================================================

          return (
            <div
              key={colIndex}
              id={`cell-${rowIndex}-${colIndex}`}
              style={{
                ...styles.mazeCell,
                backgroundColor: matchTileWithPlayerUbication
                  ? selectedColorSet.playerBackgroundColor
                  : cell.isPath
                    ? selectedColorSet.pathColor
                    : selectedColorSet.backgroundColor,
                filter: applyBlur ? `blur(${blurRadius}px)` : 'none', // Apply blur conditionally
                position: 'relative', // Ensure relative positioning for absolute positioning of icons
              }}
              onClick={handleConditionalFunction(() => {}, openLogIn)}
              onTouchStart={handleConditionalFunction(
                handleTouchStart,
                openLogIn
              )}
              onTouchMove={handleConditionalFunction(handleTouchMove, () => {})}
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
              {/* Should alway be child of the cell */}
              {matchTileWithPlayerUbication && (
                <div
                  id="player-icon"
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
                    zIndex: 1, // Ensure player is in the forefront
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
    );
  });
}
