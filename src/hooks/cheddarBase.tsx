import { wagmiConfig } from '@/configs/wagmi';
import { deployedContract } from '@/constants/contract/deployedContract';
import { useAccount, useReadContract } from 'wagmi';

export const useGetCheddarBaseBalance = () => {
  const { address } = useAccount();
  return useReadContract({
    address: deployedContract.address as `0x${string}`,
    abi: deployedContract.abi,
    functionName: 'balanceOf',
    args: [address],
    config: wagmiConfig,
    scopeKey: 'baseBalance',
  });
};
