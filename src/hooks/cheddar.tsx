import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import {
  getCheddarBalance,
  getCheddarMetadata,
  getCheddarNFTBuyPrice,
  getNFTs,
  getTotalSupply,
} from '@/contracts/cheddarCalls';
import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { getConfig } from '@/configs/config';
import { wagmiConfig } from '@/configs/wagmi';
import { useAccount, useReadContract } from 'wagmi';
import contractAbi from '@/constants/contract/abi.json';
import { parseAbi } from 'viem';

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

export const useGetCheddarTotalSupply = (): UseQueryResult<bigint> => {
  return useQuery({
    queryKey: ['useGetCheddarTotalSupply'],
    queryFn: () => getTotalSupply(),
    refetchInterval: 10000,
    staleTime: 10000,
  });
};

export const useGetCheddarNFTPrice = (
  withCheddar: boolean
): UseQueryResult<string | null> => {
  return useQuery<string | null>({
    queryKey: ['useGetCheddarNFTs', withCheddar],
    queryFn: () => getCheddarNFTBuyPrice(withCheddar),
    refetchInterval: 10000,
    staleTime: 10000,
  });
};

export const useGetCheddarBaseBalance = () => {
  const { address } = useAccount();
  return useReadContract({
    address: getConfig().contracts.base.cheddarToken as `0x${string}`,
    abi: contractAbi,
    functionName: 'balanceOf',
    args: [address],
    config: wagmiConfig,
    blockTag: 'latest',
    scopeKey: 'baseBalance',
  });
};
export const useGetCheddarBaseTotalSupply = () => {
  return useReadContract({
    address: getConfig().contracts.base.cheddarToken as `0x${string}`,
    abi: contractAbi,
    functionName: 'totalSupply',
  });
};
