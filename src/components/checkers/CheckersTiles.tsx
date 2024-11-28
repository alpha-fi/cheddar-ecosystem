import { DICTIONARY } from '@/constants/checkers';
import { CheckersContext } from '@/contexts/checkers/CheckersContextProvider';
import React, { useContext } from 'react';

export const CheckersTiles = () => {
  const { handleClickTile } = useContext(CheckersContext);
  return (
    <div className="tiles">
      {DICTIONARY.map((row, indexRow) => {
        return DICTIONARY.map((col, indexCol) => {
          return (indexRow + indexCol) % 2 === 0 ? (
            <></>
          ) : (
            <div
              key={`tile${(indexCol - (indexCol % 2)) / 2 + indexRow * 4}`}
              className={`tile`}
              id={`tile${(indexCol - (indexCol % 2)) / 2 + indexRow * 4}`}
              style={{
                top: row,
                left: col,
                backgroundColor: 'black',
              }}
              onClick={() => handleClickTile(indexRow, indexCol)}
            ></div>
          );
        });
      })}
    </div>
  );
};
