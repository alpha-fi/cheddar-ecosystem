import { PlayerScoreData } from '@/components/maze/Scoreboard';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import {
  isAllowed as isAllowedResponse,
  getSeedId,
  getPendingCheddarToMint,
  getScoreBoard,
  getEarnedButNotMinted,
  getEarnedAndMinted,
} from '@/queries/maze/api';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

export interface IsAllowedResponse {
  ok: boolean;
  errors?: string[];
}

export interface ScoreboardResponse {
  ok: boolean;
  scoreboard: {
    daily: PlayerScoreData[];
    weekly: PlayerScoreData[];
    allTime: PlayerScoreData[];
  };
}

export const useGetIsAllowedResponse =
  (): UseQueryResult<null | IsAllowedResponse> => {
    const { accountId } = useWalletSelector();
    const { address } = useAccount();
    const account = accountId || (address as string);
    return useQuery({
      queryKey: ['useGetIsAllowed', account],
      queryFn: () =>
        account ? isAllowedResponse(account, address ? 'base' : 'near') : null,
      refetchInterval: 10000,
      staleTime: 10000,
    });
  };

export const useGetScoreboard =
  (): UseQueryResult<null | ScoreboardResponse> => {
    return useQuery({
      queryKey: ['useGetScoreboard'],
      queryFn: () => getScoreBoard(),
      refetchInterval: 10000,
      staleTime: 10000,
    });
  };

export const useGetPendingCheddarToMint = (): UseQueryResult<number> => {
  const { accountId } = useWalletSelector();
  const { address } = useAccount();
  const account = accountId || (address as string);
  return useQuery({
    queryKey: ['useGetPendingCheddarToMint', account],
    queryFn: () =>
      account
        ? getPendingCheddarToMint(account, address ? 'base' : 'near')
        : null,
    refetchInterval: 10000,
    staleTime: 10000,
  });
};

export const useGetEarnedButNotMintedCheddar = (): UseQueryResult<number> => {
  const { accountId } = useWalletSelector();
  const { address } = useAccount();
  const account = accountId || (address as string);
  return useQuery({
    queryKey: ['useGetEarnedButNotMintedCheddar', accountId],
    queryFn: () =>
      account
        ? getEarnedButNotMinted(account, address ? 'base' : 'near')
        : null,
    refetchInterval: false,
    staleTime: Infinity,
  });
};

export const useGetEarnedAndMintedCheddar = (): UseQueryResult<number> => {
  const { accountId } = useWalletSelector();
  const { address } = useAccount();
  const account = accountId || (address as string);
  return useQuery({
    queryKey: ['useGetEarnedAndMintedCheddar', accountId],
    queryFn: () =>
      account ? getEarnedAndMinted(account, address ? 'base' : 'near') : null,
    refetchInterval: false,
    staleTime: Infinity,
  });
};
