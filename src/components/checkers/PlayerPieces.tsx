import { DICTIONARY } from '@/constants/checkers';
import { CheckersContext } from '@/contexts/checkers/CheckersContextProvider';
import { Image } from '@chakra-ui/react';
import React, { useContext } from 'react';

interface props {
  playerIndex: number;
}

export const PlayerPieces = ({ playerIndex }: props) => {
  const { gameBoard, selectedPiece, handleClickPiece } =
    useContext(CheckersContext);

  return (
    <div className={`player${playerIndex}pieces`}>
      {gameBoard.map((row, indexRow) =>
        row.map((piece, indexCol) =>
          piece === playerIndex || piece === -playerIndex ? (
            <div
              key={`piece${(indexCol - (indexCol % 2)) / 2 + indexRow * 4}`}
              className={`piece ${selectedPiece.row === indexRow && selectedPiece.col === indexCol ? 'selected' : ''}`}
              id={`piece${(indexCol - (indexCol % 2)) / 2 + indexRow * 4}`}
              style={{
                top: DICTIONARY[indexRow],
                left: DICTIONARY[indexCol],
              }}
              onClick={() =>
                handleClickPiece(piece, indexRow, indexCol, playerIndex - 1)
              }
            >
              {piece === -playerIndex && (
                <Image
                  src={`./assets/img/king${playerIndex}.png`}
                  alt={`Piece ${(indexCol - (indexCol % 2)) / 2 + indexRow * 4} is king`}
                />
              )}
            </div>
          ) : (
            <></>
          )
        )
      )}
    </div>
  );
};
