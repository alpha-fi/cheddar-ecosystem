import { Gameboard } from './Gameboard';
import styles from '../styles/GameboardContainer.module.css';
import {
  Button,
  Hide,
  Link,
  ListItem,
  OrderedList,
  Show,
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
import {
  ArrowBackIcon,
  ArrowDownIcon,
  ArrowForwardIcon,
  ArrowUpIcon,
} from '@chakra-ui/icons';
import { Scoreboard } from './Scoreboard';

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
    handleArrowPress,
    showMovementButtons,
    setShowMovementButtons,
  } = useContext(GameContext);

  const {
    isOpen: isOpenNotAlloWedModal,
    onOpen: onOpenNotAlloWedModal,
    onClose: onCloseNotAlloWedModal,
  } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isScoreboardOpen,
    onOpen: onOpenScoreboard,
    onClose: onCloseScoreboard,
  } = useDisclosure();
  const {
    isOpen: videoModalOpened,
    onOpen: onOpenVideoModal,
    onClose: onCloseVideoModal,
  } = useDisclosure();
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
      ? hasEnoughBalance //And have enough balance
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

  function handleToggleShowMovementButtons() {
    setShowMovementButtons(!showMovementButtons);
  }

  const renderSwipeIcon = () => {
    return (
      <svg viewBox="0 -1.5 21 21">
        <title>swipe</title>
        <defs></defs>
        <g
          id="Page-1"
          stroke="none"
          stroke-width="1"
          fill="none"
          fill-rule="evenodd"
        >
          <g
            id="Dribbble-Light-Preview"
            transform="translate(-139.000000, -800.000000)"
            fill="#000000"
          >
            <g id="icons" transform="translate(56.000000, 160.000000)">
              <path
                d="M87.2,645.00025 C87.2,644.44825 86.7296,644.00025 86.15,644.00025 L84.05,644.00025 C83.4704,644.00025 83,644.44825 83,645.00025 C83,645.55225 83.4704,646.00025 84.05,646.00025 L86.15,646.00025 C86.7296,646.00025 87.2,645.55225 87.2,645.00025 M103.38575,643.83125 L103.01195,643.47425 L99.67295,640.29325 C99.2624,639.90225 98.5967,639.90225 98.1872,640.29325 C97.77665,640.68425 97.77665,641.31725 98.1872,641.70725 L99.95225,643.26825 C100.283,643.58325 100.04885,644.00025 99.58055,644.00025 L94.18985,644.00025 C93.6092,644.00025 93.13985,644.44825 93.13985,645.00025 C93.13985,645.55225 93.6092,646.00025 94.18985,646.00025 L99.58265,646.00025 C100.05095,646.00025 100.2851,646.66025 99.95435,646.97525 L98.1872,648.71725 C97.7777,649.10825 97.7777,649.77125 98.1872,650.16225 C98.59775,650.55225 99.2624,650.56725 99.6719,650.17725 L103.38575,646.64825 C104.20475,645.86725 104.20475,644.61225 103.38575,643.83125 M97.3451,653.04225 L96.9965,656.59925 C96.80015,657.53425 95.9381,658.00025 94.93745,658.00025 L89.8607,658.00025 C89.51525,658.00025 89.1908,658.04525 88.9955,657.77425 L86.7275,653.84725 C86.4419,653.45425 86.49125,652.92325 86.8451,652.58625 C87.3008,652.15225 88.05575,652.21425 88.42535,652.71625 L89.3,653.90925 L89.3,645.41425 C89.3,644.86225 89.7746,644.41425 90.3542,644.41425 C91.10075,644.41425 91.4084,645.06025 91.4084,645.41425 L91.4168,650.45825 L95.94965,650.85625 C96.9545,651.17425 97.553,652.05325 97.3451,653.04225"
                id="swipe-toggle-icon"
              ></path>
            </g>
          </g>
        </g>
      </svg>
    );
  };

  const renderArrowsIcon = () => {
    return (
      <svg
        fill="#000000"
        viewBox="-6 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>arrows</title>
        <path d="M19.72 15.4l-2.24-2.2c-0.32-0.32-0.84-0.32-1.2 0-0.32 0.32-0.32 0.84 0 1.2l0.8 0.8h-6.28v-6.24l0.8 0.8c0.16 0.16 0.36 0.24 0.6 0.24 0.2 0 0.44-0.080 0.6-0.24 0.32-0.32 0.32-0.84 0-1.2l-2.24-2.24c-0.6-0.72-1.2-0.040-1.2-0.040l-2.24 2.24c-0.32 0.32-0.32 0.84 0 1.2 0.32 0.32 0.84 0.32 1.2 0l0.8-0.8v6.28h-6.2l0.8-0.8c0.32-0.32 0.32-0.84 0-1.2-0.32-0.32-0.84-0.32-1.2 0l-2.24 2.24c-0.32 0.32-0.32 0.84 0 1.16l2.24 2.2c0.16 0.16 0.36 0.24 0.6 0.24 0.2 0 0.44-0.080 0.6-0.24 0.32-0.32 0.32-0.84 0-1.2l-0.8-0.8h6.24v6.24l-0.8-0.8c-0.32-0.32-0.84-0.32-1.2 0-0.32 0.32-0.32 0.84 0 1.2l2.24 2.24c0.4 0.4 0.68 0.4 1.12-0.040l2.24-2.24c0.44-0.28 0.44-0.8 0.080-1.12-0.32-0.32-0.84-0.32-1.2 0l-0.8 0.8v-6.28h6.24l-0.8 0.8c-0.32 0.32-0.32 0.84 0 1.2 0.16 0.16 0.36 0.24 0.6 0.24s0.44-0.080 0.6-0.24l2.24-2.24c0.32-0.28 0.32-0.88 0-1.16z"></path>
      </svg>
    );
  };

  return (
    <div
      className={getGameContainerClasses()}
      // onKeyDown={getProperHandler(handleKeyPress)}
      onKeyDown={getKeyDownMoveHandler()}
      style={{
        maxWidth: `${mazeData[0].length * cellSize + 25}px`,
      }}
    >
      <header className={styles.headerContainer}>
        <div className={styles.headerLeftPortionContainer}>
          <Link href="#" id="logo">
            <img
              src="assets/cheddar-logo-reduced.png"
              className={styles.headerCheddarIcon}
            />
          </Link>
        </div>
        <div className={styles.headerExtension}>
          <div className={styles.ourSocialMedia}>
            <Link
              className={styles.socialMediaLinks}
              href="https://t.me/cheddarfarm"
              target="_blank"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-telegram"
                viewBox="0 0 16 16"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z" />
              </svg>
            </Link>
            <Link
              className={styles.socialMediaLinks}
              href="https://discord.gg/G9PTbmPUwe"
              target="_blank"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 448 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M297.216 243.2c0 15.616-11.52 28.416-26.112 28.416-14.336 0-26.112-12.8-26.112-28.416s11.52-28.416 26.112-28.416c14.592 0 26.112 12.8 26.112 28.416zm-119.552-28.416c-14.592 0-26.112 12.8-26.112 28.416s11.776 28.416 26.112 28.416c14.592 0 26.112-12.8 26.112-28.416.256-15.616-11.52-28.416-26.112-28.416zM448 52.736V512c-64.494-56.994-43.868-38.128-118.784-107.776l13.568 47.36H52.48C23.552 451.584 0 428.032 0 398.848V52.736C0 23.552 23.552 0 52.48 0h343.04C424.448 0 448 23.552 448 52.736zm-72.96 242.688c0-82.432-36.864-149.248-36.864-149.248-36.864-27.648-71.936-26.88-71.936-26.88l-3.584 4.096c43.52 13.312 63.744 32.512 63.744 32.512-60.811-33.329-132.244-33.335-191.232-7.424-9.472 4.352-15.104 7.424-15.104 7.424s21.248-20.224 67.328-33.536l-2.56-3.072s-35.072-.768-71.936 26.88c0 0-36.864 66.816-36.864 149.248 0 0 21.504 37.12 78.08 38.912 0 0 9.472-11.52 17.152-21.248-32.512-9.728-44.8-30.208-44.8-30.208 3.766 2.636 9.976 6.053 10.496 6.4 43.21 24.198 104.588 32.126 159.744 8.96 8.96-3.328 18.944-8.192 29.44-15.104 0 0-12.8 20.992-46.336 30.464 7.68 9.728 16.896 20.736 16.896 20.736 56.576-1.792 78.336-38.912 78.336-38.912z"></path>
              </svg>
            </Link>
            <Link
              className={styles.socialMediaLinks}
              href="https://twitter.com/CheddarFi"
              target="_blank"
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 512 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"></path>
              </svg>
            </Link>
            <Link
              className={styles.litepaperLink}
              href="https://cheddarfarm.gitbook.io/docs"
              target="_blank"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.802 17.77a.703.703 0 11-.002 1.406.703.703 0 01.002-1.406m11.024-4.347a.703.703 0 11.001-1.406.703.703 0 01-.001 1.406m0-2.876a2.176 2.176 0 00-2.174 2.174c0 .233.039.465.115.691l-7.181 3.823a2.165 2.165 0 00-1.784-.937c-.829 0-1.584.475-1.95 1.216l-6.451-3.402c-.682-.358-1.192-1.48-1.138-2.502.028-.533.212-.947.493-1.107.178-.1.392-.092.62.027l.042.023c1.71.9 7.304 3.847 7.54 3.956.363.169.565.237 1.185-.057l11.564-6.014c.17-.064.368-.227.368-.474 0-.342-.354-.477-.355-.477-.658-.315-1.669-.788-2.655-1.25-2.108-.987-4.497-2.105-5.546-2.655-.906-.474-1.635-.074-1.765.006l-.252.125C7.78 6.048 1.46 9.178 1.1 9.397.457 9.789.058 10.57.006 11.539c-.08 1.537.703 3.14 1.824 3.727l6.822 3.518a2.175 2.175 0 002.15 1.862 2.177 2.177 0 002.173-2.14l7.514-4.073c.38.298.853.461 1.337.461A2.176 2.176 0 0024 12.72a2.176 2.176 0 00-2.174-2.174"></path>
              </svg>
            </Link>
          </div>
        </div>
        <span className={styles.musicIcon} onClick={onOpenVideoModal}>
          🎶
        </span>
      </header>

      <div className={styles.publicityDecoration}></div>

      {accountId && (!hasEnoughBalance || userIsNotAllowedToPlay) && (
        <Link
          target="_blank"
          className={styles.notEnoughBalanceMsg}
          href="https://app.ref.finance/#a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.factory.bridge.near%7Ctoken.cheddar.near"
        >
          Must have {minCheddarRequired}
          {RenderCheddarIcon({ width: '2rem' })} and Verified Human to play.
        </Link>
      )}
      {selector.isSignedIn() ? (
        <div>
          <Button onClick={logOut}>Log out</Button>
        </div>
      ) : (
        <Button onClick={modal.show}>Login</Button>
      )}
      <div className={styles.gameHeaderContainer}>
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

      <Button onClick={onOpenScoreboard}>Scoreboard</Button>

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

            <Show below="lg">
              <Button
                onClick={() => handleToggleShowMovementButtons()}
                colorScheme="gray"
              >
                <div className={styles.togglePlayModeIconContainer}>
                  {showMovementButtons ? renderSwipeIcon() : renderArrowsIcon()}
                </div>
              </Button>
            </Show>
          </div>
        </div>
        <Gameboard
          openLogIn={modal.show}
          isUserLoggedIn={selector.isSignedIn()}
          isAllowedResponse={isAllowedResponse!}
        />

        {showMovementButtons && (
          <Show below="lg">
            <div className={styles.arrowButtonsContainer}>
              <div className={styles.arrowButtonsFirstLine}>
                <Button
                  onClick={() => handleArrowPress('ArrowUp')}
                  disabled={!hasPowerUp}
                >
                  <ArrowUpIcon />
                </Button>
              </div>
              <div className={styles.arrowButtonsSecondLine}>
                <Button
                  onClick={() => handleArrowPress('ArrowLeft')}
                  disabled={!hasPowerUp}
                >
                  <ArrowBackIcon />
                </Button>
                <Button
                  onClick={() => handleArrowPress('ArrowDown')}
                  disabled={!hasPowerUp}
                >
                  <ArrowDownIcon />
                </Button>
                <Button
                  onClick={() => handleArrowPress('ArrowRight')}
                  disabled={!hasPowerUp}
                >
                  <ArrowForwardIcon />
                </Button>
              </div>
            </div>
          </Show>
        )}
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
      <ModalContainer
        title={'Cheddar rap'}
        isOpen={videoModalOpened}
        onClose={onCloseVideoModal}
      >
        <div className={styles.videoContainer}>
          <video
            src="../../../assets/cheddar_rap.mp4"
            autoPlay
            controls
          ></video>
        </div>
      </ModalContainer>

      <ModalContainer
        title={'Maze scoreboard'}
        isOpen={isScoreboardOpen}
        onClose={onCloseScoreboard}
      >
        <Scoreboard />
      </ModalContainer>
    </div>
  );
}
