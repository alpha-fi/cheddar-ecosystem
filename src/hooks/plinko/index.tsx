import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import { getBallCost, getUserBalls } from '@/contracts/plinko/plinkoCalls';
import { useQuery, UseQueryResult } from '@tanstack/react-query';

export const useGetBallCost = (): UseQueryResult<null | bigint> => {
  return useQuery({
    queryKey: ['useGetBallCost'],
    queryFn: getBallCost,
    refetchInterval: 300000,
    staleTime: 300000,
  });
};

export const useGetUserBalls = (): UseQueryResult<null | number> => {
  const { accountId } = useWalletSelector();

  return useQuery({
    queryKey: ['useGetUserBalls', accountId],
    queryFn: () => (accountId ? getUserBalls(accountId) : null),
    refetchInterval: 10000,
    staleTime: 10000,
  });
};
