import { CheckersContext } from '@/contexts/checkers/CheckersContextProvider';
import React, { useContext } from 'react';

export const OnlyAfterLogIn = () => {
  const { onCopyRef, refValue } = useContext(CheckersContext);

  return (
    <div className="account only-after-login">
      <div>
        <div id="near-account-ref">
          <div>Invite a friend to get a 10% referral bonus:</div>
          <div className="invitation-input-line">
            <input className="invitation-code" type="text" value={refValue} />
            <svg
              onClick={onCopyRef}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="feather feather-copy"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
