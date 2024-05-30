import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import {
  isAllowed as isAllowedResponse,
  getSeedId,
  getPendingCheddarToMint,
} from '@/queries/api/maze';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

export interface IsAllowedResponse {
  ok: boolean;
  errors?: string[];
}

export const useGetIsAllowedResponse =
  (): UseQueryResult<null | IsAllowedResponse> => {
    const { accountId } = useWalletSelector();

    return useQuery({
      queryKey: ['useGetIsAllowed', accountId],
      queryFn: () => (accountId ? isAllowedResponse(accountId) : null),
      refetchInterval: 10000,
      staleTime: 10000,
    });
  };

export const useGetPendingCheddarToMint = (): UseQueryResult<number> => {
  const { accountId } = useWalletSelector();

  return useQuery({
    queryKey: ['useGetPendingCheddarToMint', accountId],
    queryFn: () => (accountId ? getPendingCheddarToMint(accountId) : null),
    refetchInterval: 10000,
    staleTime: 10000,
  });
};
