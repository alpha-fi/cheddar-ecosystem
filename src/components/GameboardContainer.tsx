import { Gameboard } from './Gameboard';
import styles from '../styles/GameboardContainer.module.css';
import {
  Button,
  Link,
  ListItem,
  OrderedList,
  Text,
  background,
  useDisclosure,
} from '@chakra-ui/react';
import {
  MouseEventHandler,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { GameContext } from '@/contexts/GameContextProvider';
import { ModalBuyNFT } from './ModalBuyNFT';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import { NFT, NFTCheddarContract } from '@/contracts/nftCheddarContract';
import { useGetCheddarNFTs } from '@/hooks/cheddar';
import { ModalContainer } from './FeedbackModal';
import { RenderCheddarIcon } from './RenderCheddarIcon';
import { IsAllowedResponse } from '@/hooks/maze';
import ModalNotAllowedToPlay from './ModalNotAllowedToPlay';
import ModalRules from './ModalRules';
import { GameOverModalContent } from './GameOverModalContent';
interface Props {
  remainingMinutes: number;
  remainingSeconds: number;
  handlePowerUpClick: MouseEventHandler<HTMLButtonElement>;
  cellSize: number;
  hasEnoughBalance: boolean | null;
  minCheddarRequired: number;
  isAllowedResponse: IsAllowedResponse | null | undefined;
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
    restartGame,
    timerStarted,
    setGameOverMessage,
    saveResponse,
  } = useContext(GameContext);

  const {
    isOpen: isOpenNotAlloWedModal,
    onOpen: onOpenNotAlloWedModal,
    onClose: onCloseNotAlloWedModal,
  } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showBuyNFTPanel, setShowBuyNFTPanel] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [allowOpenGameOverModal, setAllowOpenGameOverModal] = useState(false);

  if (gameOverFlag && gameOverMessage.length > 0 && !allowOpenGameOverModal) {
    onOpen();
    setAllowOpenGameOverModal(true);
  }

  const {
    isOpen: isOpenModalRules,
    onOpen: onOpenModalRules,
    onClose: onCloseModalRules,
  } = useDisclosure();

  const {
    isOpen: isOpenBuyNFTPanel,
    onOpen: onOpenBuyNFTPanel,
    onClose: onCloseBuyNFTPanel,
  } = useDisclosure();

  const [publicityDown, setPublicityDown] = useState(true);
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
    return onOpenNotAlloWedModal;
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
    return selector.isSignedIn() ? onOpenBuyNFTPanel() : modal.show();
  }

  function logOut() {
    selector.wallet().then((wallet) => wallet.signOut());
  }

  function getStartGameButtonHandler() {
    return accountId //If the accountId exists
      ? !hasEnoughBalance //And have enough balance
        ? getProperHandler(restartGame)
        : () => {} //If doesn't have enough balance
      : modal.show; //If accountId doesn't exist
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

  function smartTrim(string: string, maxLength: number) {
    if (!string) return string;
    if (maxLength < 1) return string;
    if (string.length <= maxLength) return string;
    if (maxLength == 1) return string.substring(0, 1) + '...';

    var midpoint = Math.ceil(string.length / 2);
    var toremove = string.length - maxLength;
    var lstrip = Math.ceil(toremove / 2);
    var rstrip = toremove - lstrip;
    return (
      string.substring(0, midpoint - lstrip) +
      '...' +
      string.substring(midpoint + rstrip)
    );
  }

  function handleClosePublicity() {
    setPublicityDown(!publicityDown);
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
      {publicityDown && (
        <>
          <div className={styles.publicityContainerTwo}>
            <img
              className={`${styles.learnImg} ${styles.publicityContainerImg}`}
              src="../../assets/books.svg"
              alt="learn image"
            />
            <span className={styles.publicityContainerSpan}>Learn</span>
            <img
              className={`${styles.farmImg} ${styles.publicityContainerImg}`}
              src="../../assets/farm.svg"
              alt="farm image"
            />
            <span className={styles.publicityContainerSpan}>Farm</span>
            <img
              className={styles.publicityContainerImg}
              src="../../assets/play.svg"
              alt="play image"
            />
            <span className={styles.publicityContainerSpan}>Play</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              style={{
                position: 'relative',
                top: '-30px',
                right: '-15px',
                color: '#F8F9FA',
              }}
              className="bi bi-x-circle-fill"
              viewBox="0 0 16 16"
              onClick={handleClosePublicity}
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
            </svg>
          </div>
        </>
      )}
      <div className={styles.publicityDecoration}></div>
      {accountId && !hasEnoughBalance && (
        <Link
          target="_blank"
          className={styles.notEnoughBalanceMsg}
          href="https://app.ref.finance/#a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near%7Ctoken.cheddar.near"
        >
          You must have {minCheddarRequired}
          {RenderCheddarIcon({ width: '2rem' })} to play.
        </Link>
      )}
      {selector.isSignedIn() ? (
        <div>
          <Button onClick={logOut}>Log out</Button>
        </div>
      ) : (
        <Button onClick={modal.show}>Login</Button>
      )}
      <div className={styles.headerContainer}>
        <h1 className={styles.header}>Cheddar Maze</h1>
        <span className={styles.userName}>
          {smartTrim(accountId ?? '', 10)}
        </span>
      </div>
      <div className={styles.gameInfo}>
        <div className={styles.score}>Score: {score}</div>
        <div className={styles.time}>
          Time:{' '}
          {remainingMinutes < 10 ? '0' + remainingMinutes : remainingMinutes}:
          {remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}
        </div>
      </div>

      <div className={styles.mazeContainer} tabIndex={0}>
        <div className={styles.toolbar}>
          <span className={styles.rulesButton}>
            <Button onClick={onOpenModalRules}>Rules</Button>
          </span>

          <span className={getStartButtonStyles()}>
            {/* <Button onClick={getProperHandler(restartGame)}> */}
            {hasEnoughBalance && (
              <Button onClick={getStartGameButtonHandler()}>
                {gameOverFlag ? 'Restart Game' : 'Start Game'}
              </Button>
            )}
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
                <ModalBuyNFT
                  onClose={onCloseBuyNFTPanel}
                  isOpen={isOpenBuyNFTPanel}
                />
              </span>
            )}
          </div>
        </div>
        <Gameboard
          openLogIn={modal.show}
          isUserLoggedIn={selector.isSignedIn()}
          isAllowedResponse={isAllowedResponse!}
        />
      </div>

      {userIsNotAllowedToPlay && isAllowedResponse?.errors && (
        <ModalNotAllowedToPlay
          isOpen={isOpenNotAlloWedModal}
          onClose={onCloseNotAlloWedModal}
          errors={isAllowedResponse.errors}
        />
      )}
      <ModalRules isOpen={isOpenModalRules} onClose={onCloseModalRules} />
      {gameOverFlag && gameOverMessage.length > 0 && (
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
    </div>
  );
}
