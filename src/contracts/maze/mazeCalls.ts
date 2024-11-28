import { getConfig } from '@/configs/config';
import { change, view } from '../contractUtils';
import { FinalExecutionOutcome, Wallet } from '@near-wallet-selector/core';
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
