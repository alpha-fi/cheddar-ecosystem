import { getConfig } from '@/configs/config';
import { view } from '../contractUtils';
import { Wallet } from '@near-wallet-selector/core';

const { plinkoMinter, cheddarToken } = getConfig().contracts;

const plinkoViewMethods = {
  getBallCost: 'get_ball_cost',
  getUserBalls: 'get_user_balls',
};

export const getUserBalls = async (accountId: string): Promise<any> => {
  return view(plinkoMinter, plinkoViewMethods.getUserBalls, {
    account_id: accountId,
  });
};

export const getBallCost = async (): Promise<any> => {
  return view(plinkoMinter, plinkoViewMethods.getBallCost);
};

export const buyBalls = async (
  wallet: Wallet,
  amount: string
): Promise<any> => {
  const tokenCheddarContractId = cheddarToken;
  return wallet.signAndSendTransaction({
    receiverId: tokenCheddarContractId,
    actions: [
      {
        type: 'FunctionCall',
        params: {
          methodName: 'ft_transfer_call',
          args: {
            receiver_id: plinkoMinter,
            amount,
            msg: '',
          },
          gas: '300' + '0'.repeat(12),
          deposit: '1',
        },
      },
    ],
  });
};
