import { Gameboard } from './Gameboard';
import styles from '../styles/GameboardContainer.module.css';
import {
  Button,
  Link,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
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
import {
  ChevronDownIcon,
  CloseIcon,
  HamburgerIcon,
  SmallCloseIcon,
} from '@chakra-ui/icons';
import { ntoy, yton } from '@/contracts/contractUtils';
import { BurguerMenu } from './BurguerMenu';
interface Props {
  remainingMinutes: number;
  remainingSeconds: number;
  handlePowerUpClick: MouseEventHandler<HTMLButtonElement>;
  cellSize: number;
  hasEnoughBalance: boolean | null;
  minCheddarRequired: number;
  isAllowedResponse: IsAllowedResponse | null | undefined;
  cheddarBalanceData: bigint | null | undefined;
}

export function GameboardContainer({
  remainingMinutes,
  remainingSeconds,
  handlePowerUpClick,
  cellSize,
  hasEnoughBalance,
  minCheddarRequired,
  isAllowedResponse,
  cheddarBalanceData,
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
    handleToggleBurguerMenu,
    showBurguerMenu,
  } = useContext(GameContext);

  const {
    isOpen: isOpenNotAlloWedModal,
    onOpen: onOpenNotAlloWedModal,
    onClose: onCloseNotAlloWedModal,
  } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();
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
          <Link href="#" id="logo" onClick={onOpenVideoModal}>
            <img
              src="../../../assets/cheddar-logo.png"
              className={styles.headerCheddarIcon}
            />
          </Link>
        </div>
        <div className={styles.headerRightPortionContainer}>
          {selector.isSignedIn() ? (
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                <span className={styles.balance}>
                  {cheddarBalanceData ? yton(`${cheddarBalanceData}`) : 0}
                </span>
                <RenderCheddarIcon />
              </MenuButton>
              <MenuList className={styles.menuList}>
                <MenuItem className={styles.menuItem} onClick={logOut}>
                  <Link
                    href={`https://nearblocks.io/address/${accountId}`}
                    className={styles.userName}
                    target="_blank"
                  >
                    {smartTrim(accountId ?? '', 12)}
                  </Link>
                </MenuItem>
                <MenuItem className={styles.menuItem} onClick={logOut}>
                  Log out
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button onClick={modal.show}>Login</Button>
          )}
          <Button
            onClick={() => handleToggleBurguerMenu()}
            className={styles.burguerButton}
          >
            {showBurguerMenu ? <SmallCloseIcon /> : <HamburgerIcon />}
          </Button>
        </div>
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

      <h1 className={styles.gameName}>Cheddar Maze</h1>

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
      {showBurguerMenu && <BurguerMenu />}
    </div>
  );
}
