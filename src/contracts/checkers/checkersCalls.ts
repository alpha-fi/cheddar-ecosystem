import { getConfig } from '@/configs/config';
import { change, view } from '../contractUtils';
import { FinalExecutionOutcome, Wallet } from '@near-wallet-selector/core';

const { cheddarToken, cheddarNft, checkers } = getConfig().contracts;

const checkersViewMethods = {
  getAvailablePlayers: 'get_available_players',
  getAvailableGames: 'get_available_games',
  getGame: 'get_game',
};

const checkersChangeMethods = {
  makeAvailable: 'make_available',
  makeAvailableFt: 'make_available_ft',
  startGame: 'start_game',
  makeMove: 'make_move',
  giveUp: 'give_up',
  makeUnavailable: 'make_unavailable',
  stopGame: 'stop_game',
};

export const makeMove = async (
  wallet: Wallet,
  gameId: number,
  line: string
): Promise<void | FinalExecutionOutcome> => {
  return change(
    wallet,
    checkers,
    checkersChangeMethods.makeMove,
    {
      game_id: gameId,
      line,
    },
    '0'
  );
};

export const getAvailablePlayers = async (): Promise<any> => {
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

export const buyNFT = async (
  wallet: Wallet,
  withCheddar: boolean,
  amount: string
): Promise<any> => {
  const tokenCheddarContractId = getConfig().contracts.checkers;
  if (withCheddar) {
    return wallet.signAndSendTransactions({
      transactions: [
        {
          receiverId: tokenCheddarContractId,
          actions: [
            {
              type: 'FunctionCall',
              params: {
                methodName: 'ft_transfer_call',
                args: {
                  receiver_id: cheddarNft,
                  amount,
                  msg: '',
                },
                gas: '300' + '0'.repeat(12),
                deposit: '1',
              },
            },
          ],
        },
        {
          receiverId: cheddarNft,
          actions: [
            {
              type: 'FunctionCall',
              params: {
                methodName: 'nft_mint_one',
                args: { with_cheddar: true },
                gas: '300' + '0'.repeat(12),
                deposit: '1' + '0'.repeat(21),
              },
            },
          ],
        },
      ],
    });
  } else {
    return wallet.signAndSendTransaction({
      receiverId: cheddarNft,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName: 'nft_mint_one',
            args: { with_cheddar: false },
            gas: '300' + '0'.repeat(12),
            deposit: amount,
          },
        },
      ],
    });
  }
};

export const getCheddarNFTBuyPrice = (
  withCheddar: boolean
): Promise<string> => {
  return view(cheddarNft, 'total_cost', {
    num: 1,
    // If minter is contract owner, it's free. For every other account, it has the same cost, so it can be hardcoded
    minter: 'b2a715c29af50e9cc789f92824bb5f76793acc0a12948644a498e8087e029010',
    with_cheddar: withCheddar,
  });
};
