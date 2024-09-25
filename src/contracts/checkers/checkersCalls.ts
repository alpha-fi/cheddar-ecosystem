import { getConfig } from '@/configs/config';
import { change, view } from '../contractUtils';
import {
  FinalExecutionOutcome,
  Optional,
  Transaction,
  Wallet,
} from '@near-wallet-selector/core';

const { cheddarNft, checkers } = getConfig().contracts.near;

const checkersViewMethods = {
  getAvailablePlayers: 'get_available_players',
  getAvailableGames: 'get_available_games',
  getGame: 'get_game',
};

const checkersChangeMethods = {
  makeAvailable: 'make_available',
  startGame: 'start_game',
  makeMove: 'make_move',
  giveUp: 'give_up',
  makeUnavailable: 'make_unavailable',
  stopGame: 'stop_game',
};

export const startGame = async (
  wallet: Wallet,
  accountId: string,
  opponentId: number,
  referrerId: string
): Promise<void | FinalExecutionOutcome> => {
  return change(
    wallet,
    accountId,
    checkers,
    checkersChangeMethods.startGame,
    {
      opponent_id: opponentId,
      referrer_id: referrerId,
    },
    '0'
  );
};

export const stopGame = async (
  wallet: Wallet,
  accountId: string,
  gameId: number
): Promise<void | FinalExecutionOutcome> => {
  return change(
    wallet,
    accountId,
    checkers,
    checkersChangeMethods.stopGame,
    {
      game_id: gameId,
    },
    '0'
  );
};

export const makeMove = async (
  wallet: Wallet,
  accountId: string,
  gameId: number,
  line: string
): Promise<void | FinalExecutionOutcome> => {
  return change(
    wallet,
    accountId,
    checkers,
    checkersChangeMethods.makeMove,
    {
      game_id: gameId,
      line,
    },
    '0'
  );
};

export const giveUp = async (
  wallet: Wallet,
  accountId: string,
  gameId: number
): Promise<void | FinalExecutionOutcome> => {
  return change(
    wallet,
    accountId,
    checkers,
    checkersChangeMethods.giveUp,
    {
      game_id: gameId,
    },
    '1'
  );
};

export const makeAvailable = async (
  wallet: Wallet,
  accountId: string,
  referrerId: string,
  nearAmount: string
): Promise<void | FinalExecutionOutcome> => {
  return change(
    wallet,
    accountId,
    checkers,
    checkersChangeMethods.makeAvailable,
    {
      config: { first_move: 'Random' },
      referrer_id: referrerId,
    },
    nearAmount
  );
};

export const makeUnavailable = async (
  wallet: Wallet,
  accountId: string
): Promise<void | FinalExecutionOutcome> => {
  return change(
    wallet,
    accountId,
    checkers,
    checkersChangeMethods.makeUnavailable,
    {},
    '1'
  );
};

export const ftTransferCall = async (
  wallet: Wallet,
  accountId: string,
  amount: string,
  tokenContractAddress: string
): Promise<any> => {
  return wallet.signAndSendTransaction({
    receiverId: tokenContractAddress,
    actions: [
      {
        type: 'FunctionCall',
        params: {
          methodName: 'ft_transfer_call',
          args: {
            receiver_id: checkers,
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

export const getAvailablePlayers = async (): Promise<any[]> => {
  return view(checkers, checkersViewMethods.getAvailablePlayers, {
    from_index: 0,
    limit: 50,
  });
};

export const getAvailableGames = async (): Promise<any> => {
  return view(checkers, checkersViewMethods.getAvailableGames, {
    from_index: 0,
    limit: 50,
  });
};

export const getGame = async (gameId: number): Promise<any> => {
  return view(checkers, checkersViewMethods.getGame, {
    game_id: gameId,
  });
};

export async function selectOpponent(
  wallet: Wallet,
  opponnetId: string,
  deposit: string,
  tokenId: string,
  accountId: string,
  referrerId = ''
) {
  const transactions: Optional<Transaction, 'signerId'>[] = [];

  transactions.unshift({
    receiverId: checkers,
    actions: [
      {
        type: 'FunctionCall',
        params: {
          methodName: checkersChangeMethods.startGame,
          args: {
            opponent_id: opponnetId,
            referrer_id: referrerId,
          },
          deposit: '0',
          gas: '75000000000000',
        },
      },
    ],
  });

  if (tokenId == 'NEAR') {
    const GAS_MAKE_AVAILABLE = '290000000000000';
    transactions.unshift({
      receiverId: checkers,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName: checkersChangeMethods.makeAvailable,
            args: {
              config: {
                first_move: 'Random',
              },
              referrer_id: referrerId,
            },
            deposit: deposit.toString(),
            gas: GAS_MAKE_AVAILABLE,
          },
        },
      ],
    });
  } else {
    transactions.unshift({
      receiverId: tokenId,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName: 'ft_transfer_call',
            args: {
              receiver_id: checkers,
              amount: deposit.toString(),
              msg: '',
            },
            deposit: '1',
            gas: '75000000000000',
          },
        },
      ],
    });

    let isAccountRegistered =
      (await view(tokenId, 'storage_balance_of', { account_id: accountId })) !=
      null;

    if (!isAccountRegistered) {
      transactions.unshift({
        receiverId: tokenId,
        actions: [
          {
            type: 'FunctionCall',
            params: {
              methodName: 'storage_deposit',
              args: {
                account_id: accountId,
              },
              deposit: '200000000000000000000000',
              gas: '100000000000000',
            },
          },
        ],
      });
    }
  }

  const availablePlayers = await getAvailablePlayers();

  let isCurrentPlayerWaiting = false;
  if (availablePlayers.length) {
    isCurrentPlayerWaiting = availablePlayers.reduce(
      (prev: boolean, curr: string[]) => prev || curr[0] == accountId,
      false
    );
  }

  if (isCurrentPlayerWaiting) {
    transactions.unshift({
      receiverId: checkers,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName: checkersChangeMethods.makeUnavailable,
            args: {},
            deposit: tokenId == 'NEAR' ? '0' : '1',
            gas: '100000000000000',
          },
        },
      ],
    });
  }

  return wallet.signAndSendTransactions({ transactions });
}

export const makeAvailableFt = async (
  wallet: Wallet,
  deposit: string | bigint,
  tokenId: string,
  accountId: string,
  referrerId = ''
) => {
  const transactions: Optional<Transaction, 'signerId'>[] = [];

  transactions.unshift({
    receiverId: tokenId,
    actions: [
      {
        type: 'FunctionCall',
        params: {
          methodName: 'ft_transfer_call',
          args: {
            receiver_id: checkers,
            amount: Number(deposit),
            msg: '',
          },
          deposit: '1',
          gas: '75000000000000',
        },
      },
    ],
  });

  let isAccountRegistered =
    (await view(tokenId, 'storage_balance_of', { account_id: accountId })) !=
    null;

  if (!isAccountRegistered) {
    transactions.unshift({
      receiverId: tokenId,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName: 'storage_deposit',
            args: {
              account_id: accountId,
            },
            deposit: '200000000000000000000000',
            gas: '100000000000000',
          },
        },
      ],
    });
  }

  return wallet.signAndSendTransactions({ transactions });
};
