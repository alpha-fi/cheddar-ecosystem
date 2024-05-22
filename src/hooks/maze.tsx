import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import { isAllowed } from '@/queries/api/maze';
import { UseQueryResult, useQuery } from '@tanstack/react-query';

export const useGetIsAllowed = (): UseQueryResult => {
  const { accountId } = useWalletSelector();

  return useQuery({
    queryKey: ['useGetIsAllowed', accountId],
    queryFn: () => (accountId ? isAllowed(accountId) : null),
    refetchInterval: 10000,
    staleTime: 10000,
  });
};
