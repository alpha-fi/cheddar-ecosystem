import { CheckersContext } from '@/contexts/checkers/CheckersContextProvider';
import React, { useContext } from 'react';
import { PlayerStatistics } from './PlayerStatistics';

export const GameStatistics = () => {
  const { gameData } = useContext(CheckersContext);

  return (
    <>
      {gameData && (
        <div id="near-game-stats" className="stats ">
          <h2>Game Statistics</h2>
          <div className="wrapper">
            <PlayerStatistics playerNumber={'1'} />
            <PlayerStatistics playerNumber={'2'} />
          </div>
          <div className="clearfix"></div>
          <div className="turn"></div>
          <span id="winner"></span>
          {/* <div className="">
                <button id="cleargame">Reload</button>
              </div> */}
        </div>
      )}
    </>
  );
};
