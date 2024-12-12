import { getConfig } from '@/configs/config';
import { BlockchainType } from '@/queries/maze/api';
import { Wallet } from '@near-wallet-selector/core';
import { connect } from 'near-api-js';
import { view } from '../contractUtils';
import { getNearSocial, setNearSocial } from '../socialCalls';

const config = getConfig();
const ecosystem = config.socialKeys.ecosystem;
const mazeVersion = config.socialKeys.mazeVersion;

const contracts = config.contracts;

export interface KeysOptions {
  return_type: 'True' | 'BlockHeight' | 'NodeId';
  return_deleted: boolean;
  values_only: boolean;
}

export interface MazeData {
  cheddarEarned: number;
  score: number;
  path: number[];
}

export interface MazeMetadata {
  createdAt: Date;
  seedId: number;
}

const mazeViewMethods = {
  getMazeMatchCosts: 'get_games_costs',
  getUserRemainingFreeGames: 'get_user_remaining_free_games',
  getUserRemainingPaidGames: 'get_user_remaining_paid_games',
};

export const getMazeData = async (accountId: string) => {
  const keys = [`${accountId}/index/${ecosystem}/${mazeVersion}/**`];
  return getNearSocial(keys);
};

export const setMazeData = async (
  wallet: Wallet,
  accountId: string,
  cheddarEarned: number,
  score: number,
  path: number[],
  createdAt: Date,
  seedId: number
) => {
  const data = {
    [accountId]: {
      index: {
        [ecosystem]: {
          key: mazeVersion,
          value: {
            data: {
              cheddarEarned,
              score,
              path,
            },
            metadata: {
              createdAt,
              seedId,
            },
          },
        },
      },
    },
  };

  return setNearSocial(wallet, accountId, data);
};

export const getCheddarMazeMatchPrice =
  async (/*blockchain: 'near'|'base'*/): Promise<any> => {
    return view(
      contracts[/*blockchain*/ 'near'].mazeBuyer,
      mazeViewMethods.getMazeMatchCosts
    );
  };

export const getUserRemainingFreeGames = async (
  /*blockchain: 'near'|'base',*/ accountId: string | null
): Promise<any> => {
  if (accountId) {
    return view(
      contracts[/*blockchain*/ 'near'].mazeBuyer,
      mazeViewMethods.getUserRemainingFreeGames,
      { account_id: accountId }
    );
  }
};

export const getUserRemainingPaidGames = async (
  /*blockchain: 'near'|'base',*/ accountId: string | null
): Promise<any> => {
  if (accountId) {
    return view(
      contracts[/*blockchain*/ 'near'].mazeBuyer,
      mazeViewMethods.getUserRemainingPaidGames,
      { account_id: accountId }
    );
  }
};

export function hasSuccessValue(
  status: any
): status is { SuccessValue: string } {
  return status && typeof status.SuccessValue === 'string';
}

export async function getSeedIdFromContract(wallet: Wallet) {
  const mazeBuyerContractId = getConfig().contracts.near.mazeBuyer;

  const finalExecutionOutcome = await wallet.signAndSendTransaction({
    receiverId: mazeBuyerContractId,
    actions: [
      {
        type: 'FunctionCall',
        params: {
          methodName: 'get_seed_id',
          args: {},
          gas: '300' + '0'.repeat(12),
          deposit: '1' + '0'.repeat(21),
        },
      },
    ],
  });

  if (
    !finalExecutionOutcome ||
    !hasSuccessValue(finalExecutionOutcome.status)
  ) {
    throw new Error('Failed to retrive seedId from contract');
  }

  const b64SeedId = finalExecutionOutcome.status.SuccessValue;

  return Number(Buffer.from(b64SeedId, 'base64').toString('utf-8'));
}

export async function callLoseGame(wallet: Wallet) {
  console.log("calling lose game")
  const mazeBuyerContractId = getConfig().contracts.near.mazeBuyer;

  const finalExecutionOutcome = await wallet.signAndSendTransaction({
    receiverId: mazeBuyerContractId,
    actions: [
      {
        type: 'FunctionCall',
        params: {
          methodName: 'lose_game',
          args: {},
          gas: '300' + '0'.repeat(12),
          deposit: '0',
        },
      },
    ],
  });

  if (
    !finalExecutionOutcome ||
    !hasSuccessValue(finalExecutionOutcome.status)
  ) {
    throw new Error('Failed to call lose game from contract');
  }

  const b64LoseGame = finalExecutionOutcome.status.SuccessValue;

  return Buffer.from(b64LoseGame, 'base64').toString('utf-8');
}
