import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import {
  getCheddarBalance,
  getCheddarMetadata,
  getCheddarNFTBuyPrice,
  getNFTs,
  getTotalSupply,
  isNadabotVerfied,
} from '@/contracts/cheddarCalls';
import { isHolonymVerified } from '@/queries/maze/api';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { useReadContract } from 'wagmi';
import contractAbi from '@/constants/contract/abi.json';
import { getConfig } from '@/configs/config';

export const useGetCheddarBalance = (): UseQueryResult<null | bigint> => {
  const { accountId } = useWalletSelector();

  return useQuery({
    queryKey: ['useGetCheddarBalance', accountId],
    queryFn: () => (accountId ? getCheddarBalance(accountId) : null),
    refetchInterval: 10000,
    staleTime: 10000,
  });
};

export const useGetCheddarMetadata = (): UseQueryResult => {
  return useQuery({
    queryKey: ['useGetCheddarMetadata'],
    queryFn: () => getCheddarMetadata(),
    refetchInterval: Infinity,
    staleTime: Infinity,
  });
};

export const useGetCheddarNFTs = (): UseQueryResult => {
  const { accountId } = useWalletSelector();

  return useQuery({
    queryKey: ['useGetCheddarNFTs', accountId],
    queryFn: () => (accountId ? getNFTs(accountId) : null),
    refetchInterval: 10000,
    staleTime: 10000,
  });
};

export const useGetCheddarNearTotalSupply = (): UseQueryResult<bigint> => {
  return useQuery({
    queryKey: ['useGetCheddarNearTotalSupply'],
    queryFn: () => getTotalSupply(),
    refetchInterval: 10000,
    staleTime: 10000,
  });
};

export const useGetCheddarNFTPrice = (
  withCheddar: boolean
): UseQueryResult<string | null> => {
  return useQuery<string | null>({
    queryKey: ['useGetCheddarNFTPrice', withCheddar],
    queryFn: () => getCheddarNFTBuyPrice(withCheddar),
    refetchInterval: 10000,
    staleTime: 10000,
  });
};

export const useIsNadabotVerfified = (
  accountId: string | null
): UseQueryResult<boolean> => {
  return useQuery<boolean>({
    queryKey: ['useIsNadabotVerfified', accountId],
    queryFn: () => (accountId ? isNadabotVerfied(accountId) : false),
    refetchInterval: false,
    staleTime: Infinity,
  });
};

export const useIsHolonymVerfified = (
  accountId: string | null
): UseQueryResult<boolean> => {
  return useQuery<boolean>({
    queryKey: ['useIsHolonymVerfified', accountId],
    queryFn: () => (accountId ? isHolonymVerified(accountId) : false),
    refetchInterval: false,
    staleTime: Infinity,
  });
};

export const useGetCheddarBaseBalance = (): UseQueryResult<bigint|undefined> => {
  const { address } = useAccount();
  return useReadContract({
    address: getConfig().contracts.base.cheddarToken as `0x${string}`,
    abi: contractAbi,
    functionName: 'balanceOf',
    args: [address],
    scopeKey: 'baseBalance',
    blockTag: 'latest',
    query: {
      refetchInterval: 10000,
      staleTime: 10000,
    },
  });
};
export const useGetCheddarBaseTotalSupply = (): UseQueryResult<bigint|undefined> => {
  return useReadContract({
    address: getConfig().contracts.base.cheddarToken as `0x${string}`,
    abi: contractAbi,
    functionName: 'totalSupply',
    scopeKey: 'baseTotalSupply',
    query: {
      refetchInterval: 10000,
      staleTime: 10000,
    },
  });
};
