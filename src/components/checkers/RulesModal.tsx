import { useContext } from 'react';
import { ModalContainer } from '../ModalContainer';
import { CheckersContext } from '@/contexts/checkers/CheckersContextProvider';

export const RulesModal = () => {
  const { onClose, isOpen } = useContext(CheckersContext);

  return (
    <ModalContainer
      title="Rules"
      onClose={onClose}
      isOpen={isOpen}
      maxW={{ base: '385px', md: '600px' }}
    >
      <h2>How to play:</h2>
      <ul style={{ marginLeft: '16px' }}>
        <li>
          Click a checkbox &quot;double jump&quot; on the top of the board
          before every double jump.
          {/* Shift key makes the same trick. */}
        </li>
        <li>
          Set a bid and join waiting list or select an available player to start
          the game.
        </li>
        <li>The winner takes the pot.</li>
        <li>Invite a friend to get a 10% referral bonus from his rewards.</li>
        <li>
          Check a checkbox to perform a double jump. don&apos;t check before a
          final move.
        </li>
        {/* <li>
                Hold shift button (or check a checkbox) to perform a double jump.
                Release a shift button before a final move.
              </li> */}
        <li>
          If you spent more than an hour, your opponent may stop the game and
          get the reward.
        </li>
        <li>Service fee is 10%, referral reward is half of the service fee.</li>
        <li>Various game stats are storing onchain.</li>
      </ul>
      <div className="subtitle">
        General Game Rules (
        <a
          href="https://en.wikipedia.org/wiki/Draughts"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'white', textDecoration: 'underline' }}
        >
          source
        </a>
        )
      </div>
      <ul style={{ marginLeft: '16px' }}>
        <li>Capturing is mandatory. Double capturing is not mandatory.</li>
        <li>
          Uncrowned pieces (men) move one step diagonally forwards, and capture
          an opponent&apos;s piece. Men can jump only forwards. Multiple enemy
          pieces can be captured in a single turn provided this is done by
          successive jumps made by a single piece.
        </li>
        <li>
          Kings acquires additional powers including the ability to move
          backwards and capture backwards.
        </li>
      </ul>
    </ModalContainer>
  );
};
