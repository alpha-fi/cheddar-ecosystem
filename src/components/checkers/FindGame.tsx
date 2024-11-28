import { CheckersContext } from '@/contexts/checkers/CheckersContextProvider';
import React, { useContext } from 'react';
import { AvailablePlayersList } from './AvailablePlayersList';
import { Button } from '@chakra-ui/react';

export const FindGame = () => {
  const {
    currentPlayerIsAvailable,
    handleMakeUnavailable,
    networkId,
    handleBid,
  } = useContext(CheckersContext);

  interface TokenInputProps {
    bidText: string;
    id: string;
    tokenName: string;
  }

  const TokenInput = ({ bidText, id, tokenName }: TokenInputProps) => {
    return (
      <div>
        {bidText}:{' '}
        <input type="text" id={id} defaultValue={0} style={{ width: '30px' }} />{' '}
        {tokenName}
      </div>
    );
  };

  return (
    <>
      <>
        <div id="near-available-players" className="">
          <div className="subtitle">
            Available players
            <span id="near-available-players-hint" className="">
              {' '}
              (click on a player to start a game)
            </span>
            :
          </div>
          <AvailablePlayersList />
        </div>
        <div id="near-waiting-list" className="">
          {currentPlayerIsAvailable ? (
            <div
              id="near-make-unavailable-block"
              className=""
              onClick={handleMakeUnavailable}
            >
              <Button colorScheme="purple" id="near-make-unavailable">
                Leave waiting list
              </Button>
            </div>
          ) : (
            <div id="near-make-available-block" className="">
              <div className="subtitle">
                <label htmlFor="near-bid-deposit">Join waiting list:</label>
              </div>
              <TokenInput
                bidText={'My bid'}
                id={'near-bid-deposit'}
                tokenName={'NEAR'}
              />
              <TokenInput
                bidText={'Cheddar bid'}
                id={'cheddar-bid-deposit'}
                tokenName={'Cheddar'}
              />
              {networkId === 'mainnet' && (
                <TokenInput
                  bidText={'Neko bid'}
                  id={'neko-bid-deposit'}
                  tokenName={'Neko'}
                />
              )}
              <Button
                colorScheme="purple"
                id="near-make-available"
                onClick={handleBid}
              >
                Join waiting list
              </Button>
            </div>
          )}
        </div>
      </>
    </>
  );
};
