import { CheckersContext } from '@/contexts/checkers/CheckersContextProvider';
import { yton } from '@/contracts/contractUtils';
import {
  getTimeSpent,
  getTokenName,
  isOpponentTimeSpent,
} from '@/lib/checkers';
import { useContext } from 'react';

interface props {
  playerNumber: '1' | '2';
}

export const PlayerStatistics = ({ playerNumber }: props) => {
  const { gameData, accountId, timeSpent, handleStopGame } =
    useContext(CheckersContext);

  const player1Color = '#e4a6ae';
  const player2Color = '#8b8bff';

  return (
    <div id={`player${playerNumber}`}>
      <h3>
        <div style={{ paddingBottom: '5px' }}>
          <p
            id={`near-game-player-${playerNumber}`}
            style={{
              color: playerNumber === '1' ? player1Color : player2Color,
            }}
          >
            {gameData[`player_${playerNumber}`]}
          </p>
        </div>
        <div style={{ height: '30px' }}>
          {gameData &&
            gameData.current_player_index === Number(playerNumber) - 1 && (
              <span
                id={`near-active-player-${playerNumber}`}
                className="active-player "
              >
                (Active)
              </span>
            )}
        </div>
      </h3>
      <div id={`near-player-${playerNumber}-deposit`}>
        {yton(gameData.reward.balance)} {getTokenName(gameData.reward.token_id)}
      </div>
      {timeSpent && (
        <div id={`near-player-${playerNumber}-time-spent`}>
          {timeSpent[`player${playerNumber}`]}
        </div>
      )}
      <div id={`near-player-${playerNumber}-stop-game`} className="">
        {gameData[`player_${playerNumber}`] === accountId &&
          isOpponentTimeSpent(
            getTimeSpent(
              gameData.total_time_spent[0],
              gameData.last_turn_timestamp,
              gameData.current_player_index === 0
            )
          ) && (
            <button onClick={handleStopGame} className="button centered">
              Stop game and get reward
            </button>
          )}
      </div>
    </div>
  );
};
