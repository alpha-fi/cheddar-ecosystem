import { PlayerScoreData } from '@/components/maze/Scoreboard';
import { useGlobalContext } from '@/contexts/GlobalContext';
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
    const { blockchain, selectedBlockchainAddress } = useGlobalContext();

    return useQuery({
      queryKey: ['useGetIsAllowed', selectedBlockchainAddress],
      queryFn: () =>
        selectedBlockchainAddress
          ? isAllowedResponse(selectedBlockchainAddress, blockchain)
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
  const { blockchain, selectedBlockchainAddress } = useGlobalContext();

  return useQuery({
    queryKey: ['useGetPendingCheddarToMint', selectedBlockchainAddress],
    queryFn: () =>
      selectedBlockchainAddress
        ? getPendingCheddarToMint(selectedBlockchainAddress, blockchain)
        : null,
    refetchInterval: 10000,
    staleTime: 10000,
  });
};

export const useGetEarnedButNotMintedCheddar = (): UseQueryResult<number> => {
  const { blockchain, selectedBlockchainAddress } = useGlobalContext();

  return useQuery({
    queryKey: ['useGetEarnedButNotMintedCheddar', selectedBlockchainAddress],
    queryFn: () =>
      selectedBlockchainAddress
        ? getEarnedButNotMinted(selectedBlockchainAddress, blockchain)
        : null,
    refetchInterval: false,
    staleTime: Infinity,
  });
};

export const useGetEarnedAndMintedCheddar = (): UseQueryResult<number> => {
  const { blockchain, selectedBlockchainAddress } = useGlobalContext();

  return useQuery({
    queryKey: ['useGetEarnedAndMintedCheddar', selectedBlockchainAddress],
    queryFn: () =>
      selectedBlockchainAddress
        ? getEarnedAndMinted(selectedBlockchainAddress, blockchain)
        : null,
    refetchInterval: false,
    staleTime: Infinity,
  });
};
