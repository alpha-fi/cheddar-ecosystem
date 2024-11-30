import React from 'react';
import { Gameboard } from './Gameboard';
import { PlinkoBoard } from '../plinko/PlinkoGameboard';
import styles from '@/styles/GameboardContainer.module.css';
import {
  Button,
  Flex,
  Heading,
  Hide,
  HStack,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Show,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import {
  MouseEventHandler,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { GameContext } from '@/contexts/maze/GameContextProvider';
import { ModalBuy } from '../ModalBuy';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import { ModalContainer } from '../ModalContainer';
import { RenderCheddarIcon } from './RenderCheddarIcon';
import ModalNotAllowedToMint from './ModalNotAllowedToMint';
import ModalRules from './ModalRules';
import { GameOverModalContent } from './GameOverModalContent';
import {
  ArrowBackIcon,
  ArrowDownIcon,
  ArrowForwardIcon,
  ArrowUpIcon,
  CopyIcon,
} from '@chakra-ui/icons';
import { Scoreboard } from './Scoreboard';
import { callMintCheddar } from '@/queries/maze/api';
import { getConfig } from '@/configs/config';
import ModalHolonym from '../ModalHolonymSBT';
import { useAccount } from 'wagmi';
import { useGlobalContext } from '@/contexts/GlobalContext';
import { IsAllowedResponse } from '@/hooks/maze';
import { AutoPlayAudio } from '../Navbar/components/AutoPlayAudio';

interface Props {
  remainingMinutes: number;
  remainingSeconds: number;
  handlePowerUpClick: MouseEventHandler<HTMLButtonElement>;
  cellSize: number;
  hasEnoughBalance: boolean | null;
  minCheddarRequired: number;
  isAllowedResponse: IsAllowedResponse | null | undefined;
}

interface CheddarMintResponse {
  ok?: boolean;
  cheddarMinted?: number;
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
    handleKeyPress,
    restartGame,
    timerStarted,
    setGameOverMessage,
    saveResponse,
    plinkoModalOpened,
    closePlinkoModal,
    nfts,
    handleArrowPress,
    showMovementButtons,
    setShowMovementButtons,
    onOpenScoreboard,
    isScoreboardOpen,
    onCloseScoreboard,
    isMobile,
    earnedButNotMintedCheddar,
    isUserNadabotVerfied,
    isUserHolonymVerified,
    totalMintedCheddarToDate,
    selectedColorSet,
    freeMatchesLeft,
    payedMatchesLeft,
    freeMatchesLeftLoading,
    payedMatchesLeftLoading,
    startingGame,
    setStartingGame,
    gameboardRef,
  } = useContext(GameContext);

  const { addresses, isConnected, showConnectionModal, blockchain } =
    useGlobalContext();

  const {
    isOpen: isOpenNotAlloWedModal,
    onOpen: onOpenNotAlloWedModal,
    onClose: onCloseNotAlloWedModal,
  } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [allowOpenGameOverModal, setAllowOpenGameOverModal] = useState(false);

  useEffect(() => {
    if (timerStarted) {
      setStartingGame(false);
    }
  }, [timerStarted]);

  const walletSelector = useWalletSelector();

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
    isOpen: isOpenBuyPanel,
    onOpen: onOpenBuyPanel,
    onClose: onCloseBuyPanel,
  } = useDisclosure();

  const { showSelectWalletModal } = useWalletSelector();

  const [showMintErrorModal, setMintErrorModal] = useState(false);
  const [cheddarMintResponse, setCheddarMintResponse] =
    useState<CheddarMintResponse | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (
      cheddarMintResponse &&
      cheddarMintResponse?.ok &&
      cheddarMintResponse.cheddarMinted &&
      cheddarMintResponse.cheddarMinted > 0
    ) {
      toast({
        title: 'Cheddar Minted Successfully!',
        status: 'success',
        duration: 9000,
        position: 'bottom-right',
        isClosable: true,
      });
    }

    if (cheddarMintResponse && !cheddarMintResponse?.ok) {
      toast({
        title: 'Error Minting Cheddar',
        status: 'error',
        duration: 9000,
        position: 'bottom-right',
        isClosable: true,
      });
    }
  }, [cheddarMintResponse, toast]);

  /**
   * Expects freeMatchesLeft & payedMatchesLeft to be defined
   * @returns
   */
  function getProperHandler() {
    if (!isAllowedResponse?.ok) {
      return onOpenNotAlloWedModal;
    }

    if (freeMatchesLeft! + payedMatchesLeft! > 0) {
      return restartGame;
    } else {
      return onOpenBuyPanel;
    }
  }

  function getGameContainerClasses() {
    return `${styles.gameContainer}`;
    // return `${styles.gameContainer} backgroundImg${selectedColorSet}`;
  }

  function handleBuyClick() {
    return addresses['near'] ? onOpenBuyPanel() : showSelectWalletModal(true); ///TODO: check if buy is only with near
  }

  function getStartGameButtonHandler() {
    if (startingGame) {
      return () => {}; //If the game is starting disable the button until game starts (When it get's hided)
    }
    return isConnected //If the accountId exists
      ? getProperHandler()
      : showConnectionModal; //If accountId doesn't exist
  }

  function getKeyDownMoveHandler() {
    return timerStarted ? handleKeyPress : () => {};
  }

  function getStartButtonStyles() {
    return `${styles.rulesButton} ${timerStarted ? styles.hideButton : ''}`;
  }

  function closeGameOverModal() {
    setGameOverMessage('');
    onClose();
    setAllowOpenGameOverModal(false);
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
          strokeWidth="1"
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

  function getPowerUpBtnText() {
    if (addresses['near']) {
      if (nfts?.length) {
        return '⚡';
      } else return 'Buy ⚡';
    } else {
      return 'Buy ⚡';
    }
  }
  const shareReferralLink =
    'https://' +
    new URL(window.location.href).host +
    `?referralId=${addresses['near']}`;

  const notAllowedToPlay = addresses['base']
    ? false
    : (!isUserNadabotVerfied &&
        !isUserHolonymVerified &&
        earnedButNotMintedCheddar >= 100) ||
      (!hasEnoughBalance && earnedButNotMintedCheddar >= 100) ||
      (!hasEnoughBalance && totalMintedCheddarToDate >= 100);

  const [showHolonymModal, setHolonymModal] = useState(false);

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Link copied successfully!',
      status: 'success',
      duration: 9000,
      position: 'bottom-right',
      isClosable: true,
    });
  }

  const { nadaBotUrl, buyCheddarInRefUrl } = getConfig().networkData;

  function getErrorText() {
    const nadabotLink = (
      <Link
        href={nadaBotUrl}
        style={{ textDecoration: 'underline' }}
        target="_blank"
      >
        Nadabot
      </Link>
    );

    const holonymLink = (
      <Link
        onClick={() => setHolonymModal(true)}
        style={{ textDecoration: 'underline' }}
        target="_blank"
      >
        Holonym
      </Link>
    );

    const refLink = (
      <Link
        href={buyCheddarInRefUrl}
        style={{ textDecoration: 'underline' }}
        target="_blank"
      >
        Ref
      </Link>
    );

    const cheddarIcon = RenderCheddarIcon({ width: '1rem' });

    let message;

    if (!isUserNadabotVerfied && !isUserHolonymVerified && !hasEnoughBalance) {
      message = (
        <>
          Verify on {nadabotLink} or {holonymLink} and buy/hold 555{' '}
          {cheddarIcon} from {refLink}.
        </>
      );
    } else if (
      (isUserNadabotVerfied || isUserHolonymVerified) &&
      !hasEnoughBalance
    ) {
      message = (
        <>
          Buy/hold 555 {cheddarIcon} from {refLink}.
        </>
      );
    } else if (
      !isUserNadabotVerfied &&
      !isUserHolonymVerified &&
      hasEnoughBalance
    ) {
      message = (
        <>
          Verify on {nadabotLink} or {holonymLink}.
        </>
      );
    }

    return <span>{message}</span>;
  }

  const handleLogin = () => {
    walletSelector.modal.show();
  };

  function getGameInfoClases(subtitle: string) {
    return `${styles[subtitle]} ${styles.subtitle}`;
  }

  return (
    <div
      className={getGameContainerClasses()}
      onKeyDown={getKeyDownMoveHandler()}
      style={{
        maxWidth: `${mazeData[0].length * cellSize + 50}px`,
      }}
    >
      <div className={styles.publicityDecoration}></div>
      <ModalHolonym
        isOpen={showHolonymModal}
        onClose={() => setHolonymModal(false)}
      />
      {notAllowedToPlay && (
        <div className={styles.notAllowedToPlayText}>
          To keep playing and claim rewards: {getErrorText()}
        </div>
      )}
      <h1 className={styles.gameName}>Cheddar Maze</h1>
      <div className={styles.gameInfo}>
        {blockchain === 'near' && (
          <>
            {!freeMatchesLeftLoading &&
            !payedMatchesLeftLoading &&
            typeof freeMatchesLeft === 'number' &&
            typeof payedMatchesLeft === 'number' ? (
              <Tooltip
                label={
                  <VStack gap={0} alignItems={'start'}>
                    <Text>Free: {freeMatchesLeft}</Text>
                    <Text>Purchased: {payedMatchesLeft}</Text>
                  </VStack>
                }
              >
                <div className={getGameInfoClases('games')}>
                  {`Games: ${freeMatchesLeft + payedMatchesLeft}`}
                </div>
              </Tooltip>
            ) : (
              <Spinner />
            )}
          </>
        )}
        <div className={getGameInfoClases('score')}>Score: {score}</div>
        <div className={getGameInfoClases('time')}>
          Time:{' '}
          {remainingMinutes < 10 ? '0' + remainingMinutes : remainingMinutes}:
          {remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}
        </div>
      </div>
      <div className={styles.mazeContainer} ref={gameboardRef} tabIndex={0}>
        <div className={styles.toolbar}>
          {earnedButNotMintedCheddar > 0 && (
            <Button
              px={{ base: 2, md: 3 }}
              _hover={{ bg: 'yellowgreen' }}
              isLoading={isClaiming}
              onClick={async () => {
                if (!isUserNadabotVerfied && !isUserHolonymVerified) {
                  setMintErrorModal(true);
                  return;
                } else {
                  setIsClaiming(true);
                  const response = await callMintCheddar({
                    accountId: addresses['near'] as string,
                    blockchain: 'near', ///TODO: check backend
                  });
                  setIsClaiming(false);
                  setCheddarMintResponse(response);
                }
              }}
            >
              {earnedButNotMintedCheddar} 🧀
            </Button>
          )}
          {showMintErrorModal && (
            <ModalNotAllowedToMint
              isOpen={showMintErrorModal}
              onClose={() => setMintErrorModal(!showMintErrorModal)}
              earnedButNotMintedCheddar={earnedButNotMintedCheddar}
            />
          )}
          <span className={styles.rulesButton}>
            <Button
              px={{ base: 2, md: 3 }}
              _hover={{ bg: 'yellowgreen' }}
              onClick={onOpenModalRules}
            >
              Rules
            </Button>
          </span>
          <div className={styles.toolbarbuttons}>
            <Button
              px={{ base: 2, md: 3 }}
              _hover={{ bg: 'yellowgreen' }}
              onClick={onOpenScoreboard}
            >
              🏆
            </Button>
            {(isUserNadabotVerfied || isUserHolonymVerified) && (
              <Menu>
                <MenuButton _hover={{ bg: 'yellowgreen' }} as={Button}>
                  🔗
                </MenuButton>
                <MenuList
                  minWidth="auto"
                  p="0"
                  borderRadius="full"
                  bg="yellowCheddar"
                >
                  <MenuItem
                    onClick={() => copyToClipboard(shareReferralLink)}
                    className={styles.referralLink}
                  >
                    {shareReferralLink}
                    <CopyIcon />
                  </MenuItem>
                </MenuList>
              </Menu>
            )}

            {blockchain === 'near' && (
              <Button
                px={{ base: 2, md: 3 }}
                colorScheme={nfts && nfts.length > 0 ? 'green' : 'yellow'}
                onClick={onOpenBuyPanel}
              >
                {getPowerUpBtnText()}
              </Button>
            )}
          </div>
          <Show below="lg">
            <Button
              px={{ base: 2, md: 3 }}
              onClick={() => handleToggleShowMovementButtons()}
              colorScheme="gray"
            >
              <div className={styles.togglePlayModeIconContainer}>
                {showMovementButtons ? renderSwipeIcon() : renderArrowsIcon()}
              </div>
            </Button>
          </Show>
        </div>
        <div
          style={{ position: 'relative' }}
          className={`pathColorSet${selectedColorSet}`}
        >
          <Gameboard
            openLogIn={showConnectionModal}
            isUserLoggedIn={isConnected}
            isAllowedResponse={isAllowedResponse!}
          />
        </div>
        {!notAllowedToPlay && !timerStarted && isConnected && (
          <div className={styles.startGameBg}>
            <Heading as="h6" size="lg">
              Play Cheddar Maze
            </Heading>
            <ul>
              <li>Fill all Cells in Maze</li>
              <li>Find door🚪 in 2min ⏰</li>
              <li>Encounter Enemies ⚔️</li>
              <li>Find PopUp🎰 Plinko🟠</li>
              <li>PowerUps Boosts Winnings🏆 🧀 ⚔️</li>
            </ul>
            <Flex wrap={'wrap'} m={'0 0.7rem'}>
              <span>✅: filled cell |</span>
              <span>🧀: Cheddar |</span>
              <span>💰: 🧀 Bag |</span>
              <span>⚔️: Won Dustup |</span>
              <span>🎰 Plinko</span>
            </Flex>
            <Button
              _hover={{ bg: 'yellowgreen' }}
              onClick={getStartGameButtonHandler()}
            >
              {startingGame ||
              (freeMatchesLeft === undefined &&
                payedMatchesLeft === undefined) ? (
                <Spinner />
              ) : gameOverFlag ? (
                'Restart'
              ) : (
                'Start'
              )}
            </Button>
          </div>
        )}
        {showMovementButtons && (
          <Show below="lg">
            <div className={styles.arrowButtonsContainer}>
              <div className={styles.arrowButtonsFirstLine}>
                <Button
                  onClick={() => handleArrowPress('ArrowUp')}
                  isDisabled={
                    !addresses['near'] || !timerStarted || notAllowedToPlay
                  }
                >
                  <ArrowUpIcon />
                </Button>
              </div>
              <div className={styles.arrowButtonsSecondLine}>
                <Button
                  onClick={() => handleArrowPress('ArrowLeft')}
                  isDisabled={
                    !addresses['near'] || !timerStarted || notAllowedToPlay
                  }
                >
                  <ArrowBackIcon />
                </Button>
                <Button
                  onClick={() => handleArrowPress('ArrowDown')}
                  isDisabled={
                    !addresses['near'] || !timerStarted || notAllowedToPlay
                  }
                >
                  <ArrowDownIcon />
                </Button>
                <Button
                  onClick={() => handleArrowPress('ArrowRight')}
                  isDisabled={
                    !addresses['near'] || !timerStarted || notAllowedToPlay
                  }
                >
                  <ArrowForwardIcon />
                </Button>
              </div>
            </div>
          </Show>
        )}
      </div>
      <ModalBuy
        onClose={onCloseBuyPanel}
        isOpen={isOpenBuyPanel}
        handleBuyClick={handleBuyClick}
      />
      <ModalRules isOpen={isOpenModalRules} onClose={onCloseModalRules} />
      {gameOverFlag && gameOverMessage.length > 0 && (
        <ModalContainer
          title={''}
          isOpen={isOpen}
          onClose={closeGameOverModal}
          neverCloseOnOverlayClick={true}
        >
          <GameOverModalContent
            handleBuyClick={handleBuyClick}
            setHolonymModal={setHolonymModal}
            onClose={closeGameOverModal}
          />
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
        title={'Plinko game!'}
        isOpen={plinkoModalOpened}
        onClose={closePlinkoModal}
        size={isMobile ? 'full' : 'xl'}
        neverCloseOnOverlayClick={true}
        hideButtons={true}
        showCloseBtn={false}
      >
        <PlinkoBoard />
      </ModalContainer>
      <ModalContainer
        title={'Maze scoreboard'}
        isOpen={isScoreboardOpen}
        onClose={onCloseScoreboard}
        neverCloseOnOverlayClick={true}
      >
        <Scoreboard />
      </ModalContainer>
    </div>
  );
}
