import { PlayerScoreData } from '@/components/maze/Scoreboard';
import { getConfig } from '@/configs/config';
import { wagmiConfig } from '@/configs/wagmi';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import {
  isAllowed as isAllowedResponse,
  getSeedId,
  getPendingCheddarToMint,
  getScoreBoard,
} from '@/queries/maze/api';
import contractAbi from '@/constants/contract/abi.json';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { useAccount, useReadContract } from 'wagmi';

export interface IsAllowedResponse {
  ok: boolean;
  errors?: string[];
}

export interface ScoreboardResponse {
  ok: boolean;
  scoreboard: PlayerScoreData[];
}

export const useGetIsAllowedResponse =
  (): UseQueryResult<null | IsAllowedResponse> => {
    const { accountId } = useWalletSelector();
    const { address } = useAccount();

    return useQuery({
      queryKey: ['useGetIsAllowed', accountId || address],
      queryFn: () =>
        accountId
          ? isAllowedResponse(
              accountId || (address as string),
              address ? 'base' : 'near'
            )
          : null,
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
