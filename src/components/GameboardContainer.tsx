import { Gameboard } from './Gameboard';
import styles from '../styles/GameboardContainer.module.css';
import { Button, Text, useDisclosure } from '@chakra-ui/react';
import {
  MouseEventHandler,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { GameContext } from '@/contexts/GameContextProvider';
import { RenderBuyNFTSection } from './BuyNFTSection';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import { NFT, NFTCheddarContract } from '@/contracts/nftCheddarContract';
import { useGetCheddarNFTs } from '@/hooks/cheddar';
import { ModalContainer } from './FeedbackModal';
import { RenderCheddarIcon } from './RenderCheddarIcon';
import { isAllowedResponse } from '@/hooks/maze';
import { RenderIsAllowedErrors } from './RenderIsAllowedErrors';
import { GameOverModalContent } from './GameOverModalContent';
import { Scoreboard } from './Scoreboard';

interface Props {
  remainingMinutes: number;
  remainingSeconds: number;
  handlePowerUpClick: MouseEventHandler<HTMLButtonElement>;
  cellSize: number;
  hasEnoughBalance: boolean | null;
  minCheddarRequired: number;
  isAllowedResponse: isAllowedResponse | null | undefined;
}

export function GameboardContainer({
  remainingMinutes,
  remainingSeconds,
  handlePowerUpClick,
  cellSize,
  hasEnoughBalance,
  minCheddarRequired,
  isAllowedResponse,
}: Props) {
  const {
    mazeData,
    score,
    gameOverFlag,
    gameOverMessage,
    selectedColorSet,
    hasPowerUp,
    isPowerUpOn,
    remainingTime,
    handleKeyPress,
    handleTouchMove,
    restartGame,
    timerStarted,
    setGameOverMessage,
    saveResponse,
  } = useContext(GameContext);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: scoreboardOpened,
    onOpen: onOpenScoreboard,
    onClose: onCloseScoreboard,
  } = useDisclosure();
  const [showBuyNFTPanel, setShowBuyNFTPanel] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [allowOpenGameOverModal, setAllowOpenGameOverModal] = useState(false);

  if (gameOverFlag && gameOverMessage.length > 0 && !allowOpenGameOverModal) {
    onOpen();
    setAllowOpenGameOverModal(true);
  }

  function toggleShowRules() {
    setShowRules(!showRules);
  }

  function handleLoggedBuyClick() {
    setShowBuyNFTPanel(!showBuyNFTPanel);
  }

  const [contract, setContract] = useState<NFTCheddarContract | undefined>();
  const [nfts, setNFTs] = useState<NFT[]>([]);
  const { data: cheddarNFTsData, isLoading: isLoadingCheddarNFTs } =
    useGetCheddarNFTs();
  const { modal, selector, accountId } = useWalletSelector();

  const userIsNotAllowedToPlay = useMemo(() => {
    return accountId && !isAllowedResponse?.ok;
  }, [accountId, isAllowedResponse?.ok]);

  function getProperHandler(handler: any) {
    //Uncomment the next line to ignore the isAllowedResponse.ok returning false
    // return handler;
    if (isAllowedResponse?.ok) {
      return handler;
    }
    return onOpen;
  }

  useEffect(() => {
    if (!selector.isSignedIn()) {
      setNFTs([]);
      return;
    }
    selector.wallet().then((wallet) => {
      const contract = new NFTCheddarContract(wallet);
      setContract(contract);

      contract.getNFTs('silkking.testnet').then((nfts) => {
        setNFTs(nfts);
      });
    });
  }, [selector]);

  function getGameContainerClasses() {
    return `${styles.gameContainer} backgroundImg${selectedColorSet}`;
  }

  function handleBuyClick() {
    return selector.isSignedIn() ? handleLoggedBuyClick() : modal.show();
  }

  function logOut() {
    selector.wallet().then((wallet) => wallet.signOut());
  }

  function getStartGameButtonHandler() {
    return accountId ? getProperHandler(restartGame) : modal.show;
  }

  function getKeyDownMoveHandler() {
    return timerStarted ? getProperHandler(handleKeyPress) : () => {};
  }

  function getStartButtonStyles() {
    return `${styles.rulesButton} ${timerStarted ? styles.hideButton : ''}`;
  }

  function closeGameOverModal() {
    setGameOverMessage('');
    onClose();
    setAllowOpenGameOverModal(false);
  }

  return (
    <div
      className={getGameContainerClasses()}
      // onKeyDown={getProperHandler(handleKeyPress)}
      onKeyDown={getKeyDownMoveHandler()}
      style={{
        maxWidth: `${mazeData[0].length * cellSize + 25}px`,
      }}
    >
      {accountId && !hasEnoughBalance && (
        <Text color="tomato">
          You have to hold at least {minCheddarRequired}
          {RenderCheddarIcon({ width: '2rem' })} to earn.
        </Text>
      )}
      {
        <div className={styles.headerButtonsContainer}>
          <Button onClick={onOpenScoreboard}>Scoreboard</Button>
          {selector.isSignedIn() ? (
            <div>
              <Button onClick={logOut}>Log out</Button>
            </div>
          ) : (
            <Button onClick={modal.show}>Login</Button>
          )}
        </div>
      }
      <h1 className={styles.gameName}>Cheddar Maze</h1>
      <div className={styles.gameInfo}>
        <div className={styles.score}>Score: {score}</div>
        <div className={styles.time}>
          Time:{' '}
          {remainingMinutes < 10 ? '0' + remainingMinutes : remainingMinutes}:
          {remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}
        </div>
      </div>

      <div
        className={styles.mazeContainer}
        tabIndex={0}
        // onKeyDown={getProperHandler(handleKeyPress)}
        // onKeyDown={getKeyDownMoveHandler()}
        onTouchMove={getProperHandler(handleTouchMove)}
      >
        <div className={styles.toolbar}>
          <span className={styles.rulesButton}>
            <Button onClick={toggleShowRules}>Rules</Button>
          </span>

          <span className={getStartButtonStyles()}>
            {/* <Button onClick={getProperHandler(restartGame)}> */}
            <Button onClick={getStartGameButtonHandler()}>
              {gameOverFlag ? 'Restart Game' : 'Start Game'}
            </Button>
          </span>

          <div className={styles.tooltip}>
            <Button
              colorScheme="yellow"
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
                  colorScheme="purple"
                  onClick={handleBuyClick}
                  disabled={!hasPowerUp}
                >
                  Buy
                </Button>
                {showBuyNFTPanel && (
                  <div className={styles.popup}>
                    <RenderBuyNFTSection />
                  </div>
                )}
              </span>
            )}
          </div>
        </div>
        <Gameboard
          showRules={showRules}
          openLogIn={modal.show}
          isUserLoggedIn={selector.isSignedIn()}
          isAllowedResponse={isAllowedResponse!}
        />
      </div>

      {!saveResponse && userIsNotAllowedToPlay && isAllowedResponse?.errors && (
        <ModalContainer
          title={'Ups! You cannot play'}
          isOpen={isOpen}
          onClose={onClose}
        >
          <RenderIsAllowedErrors errors={isAllowedResponse?.errors!} />
        </ModalContainer>
      )}
      {!saveResponse && gameOverFlag && gameOverMessage.length > 0 && (
        <ModalContainer
          title={'Game over'}
          isOpen={isOpen}
          onClose={closeGameOverModal}
        >
          <GameOverModalContent />
        </ModalContainer>
      )}
      {saveResponse && (
        <ModalContainer
          title={'Error saving game'}
          isOpen={isOpen}
          onClose={onClose}
        >
          <div>
            {saveResponse.map((error, index) => {
              return <div key={index}>{error}</div>;
            })}
          </div>
        </ModalContainer>
      )}

      <ModalContainer
        title={'Scoreboard'}
        isOpen={scoreboardOpened}
        onClose={onCloseScoreboard}
      >
        <Scoreboard />
      </ModalContainer>
    </div>
  );
}
