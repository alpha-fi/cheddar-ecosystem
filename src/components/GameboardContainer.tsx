import { Gameboard } from './Gameboard';
import { Button, ListItem, OrderedList, background } from '@chakra-ui/react';
import { MouseEventHandler, useContext, useEffect, useState } from 'react';

import { GameContext } from '@/contexts/GameContextProvider';
import { RenderBuyNFTSection } from './BuyNFTSection';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import { NFT, NFTCheddarContract } from '@/contracts/nftCheddarContract';
import { useGetCheddarNFTs } from '@/hooks/cheddar';

interface Props {
  remainingMinutes: number;
  remainingSeconds: number;
  handlePowerUpClick: MouseEventHandler<HTMLButtonElement>;
  handleBuyClick: MouseEventHandler<HTMLButtonElement>;
  cellSize: number;
  cheddarTokenImg: undefined | string;
}

export function GameboardContainer({
  remainingMinutes,
  remainingSeconds,
  handlePowerUpClick,
  handleBuyClick,
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

  const [contract, setContract] = useState<NFTCheddarContract | undefined>();
  const [nfts, setNFTs] = useState<NFT[]>([]);
  const { data: cheddarNFTsData, isLoading: isLoadingCheddarNFTs } =
    useGetCheddarNFTs();
  const { modal, selector, accountId } = useWalletSelector();

  useEffect(() => {
    console.log(1);
    if (!selector.isSignedIn()) {
      console.log(2);
      setNFTs([]);
      return;
    }
    console.log(3);
    selector.wallet().then((wallet) => {
      const contract = new NFTCheddarContract(wallet);
      setContract(contract);

      contract.getNFTs('silkking.testnet').then((nfts) => {
        console.log(nfts);
        setNFTs(nfts);
      });
    });
  }, [selector]);

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
      touchAction: 'none',
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
      backgroundColor: selectedColorSet.playerBackgroundColor,
      pointerEvents: 'none',
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
      zIndex: 1,
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
      zIndex: 3,
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
      {selector.isSignedIn() ? (
        <div
          onClick={() => selector.wallet().then((wallet) => wallet.signOut())}
        >
          Logged in with {nfts.length} NFTs!
        </div>
      ) : (
        <Button onClick={modal.show}>Login</Button>
      )}
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
                  <RenderBuyNFTSection />
                </div>
              </span>
            )}
          </div>
        </div>
        <Gameboard styles={styles} />
      </div>

      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '10px',
        }}
      >
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
