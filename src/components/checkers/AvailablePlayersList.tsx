import { CheckersContext } from '@/contexts/checkers/CheckersContextProvider';
import { yton } from '@/contracts/contractUtils';
import { getTokenName } from '@/lib/checkers';
import React, { useContext } from 'react';

export const AvailablePlayersList = () => {
  const { accountId, availablePlayersData, handleSelectOpponent } =
    useContext(CheckersContext);
  return (
    <div id="near-available-players-list">
      {availablePlayersData.map((player: any) => {
        const token_id = player[1].token_id;
        let displayableTokenName = getTokenName(token_id);
        if (player[0] !== accountId) {
          return (
            <li key={player}>
              <div
                onClick={() =>
                  handleSelectOpponent(player[0], player[1].deposit, token_id)
                }
                style={{
                  cursor: 'pointer',
                  display: 'inline',
                  textDecoration: 'underline',
                }}
              >
                {player[0]}, bid: {yton(player[1].deposit)}{' '}
                {displayableTokenName}
              </div>
            </li>
          );
        } else {
          return (
            <li key={player}>
              <strong>
                {player[0]}, bid: {yton(player[1].deposit)}{' '}
                {displayableTokenName}
              </strong>
            </li>
          );
        }
      })}
    </div>
  );
};
