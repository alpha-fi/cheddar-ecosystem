import React from 'react';
import { ActionButtons } from './ActionButtons';
import { CheckersTiles } from './CheckersTiles';
import { PlayerPieces } from './PlayerPieces';

export const CheckersGameboard = () => {
  return (
    <div className="column">
      <ActionButtons />
      <div id="board">
        <CheckersTiles />
        <div className="pieces">
          <PlayerPieces playerIndex={1} />
          <PlayerPieces playerIndex={2} />
        </div>
      </div>
    </div>
  );
};
