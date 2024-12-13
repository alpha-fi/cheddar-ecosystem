import { getConfig } from '@/configs/config';
import { ntoy, view } from './contractUtils';
import { Metadata } from './CheddarToken';
import { NFT } from './nftCheddarContract';
import { Transaction, Wallet } from '@near-wallet-selector/core';
import Big from 'big.js';
import { hasSuccessValue } from './maze/mazeBuyerCalls';

const { cheddarToken, cheddarNft, nadaBot } = getConfig().contracts.near;

const tokenViewMethods = {
  ftBalanceOf: 'ft_balance_of',
  ftMetadata: 'ft_metadata',
  ftTotalSupply: 'ft_total_supply',
};

const nftViewMethods = {
  nftTokensForOwner: 'nft_tokens_for_owner',
  nftMintOne: 'nft_mint_one',
};

export const ftTransferCall = async (
  wallet: Wallet,
  tokenContractAddress: string,
  receiverId: string,
  amount: number,
  msg: string = ''
): Promise<any> => {
  return wallet.signAndSendTransaction({
    receiverId: tokenContractAddress,
    actions: [
      {
        type: 'FunctionCall',
        params: {
          methodName: 'ft_transfer_call',
          args: {
            receiver_id: receiverId,
            amount: ntoy(amount).toString(),
            msg,
          },
          gas: '300' + '0'.repeat(12),
          deposit: '1',
        },
      },
    ],
  });
};

export const getCheddarBalance = async (accountId: string): Promise<bigint> => {
  return view(cheddarToken, tokenViewMethods.ftBalanceOf, {
    account_id: accountId,
  }).then(BigInt);
};

export const getNFTCheddarBalance = async (
  accountId: string
): Promise<NFT[]> => {
  return view(cheddarNft, 'balance_of', {
    account_id: accountId,
  });
};

export const getTotalSupply = async (): Promise<bigint> => {
  return view(cheddarToken, tokenViewMethods.ftTotalSupply)
    .then(BigInt)
    .then((a) => {
      return a;
    });
};

export const getCheddarMetadata = async (): Promise<Metadata> => {
  return view(cheddarToken, tokenViewMethods.ftMetadata);
};

export const getNFTs = async (accountId: string): Promise<NFT[]> => {
  return view(cheddarNft, nftViewMethods.nftTokensForOwner, {
    account_id: accountId,
  });
};

export const isNadabotVerfied = async (accountId: string): Promise<boolean> => {
  return view(nadaBot, 'is_human', {
    account_id: accountId,
  });
};

export const buyNFT = async (
  wallet: Wallet,
  withCheddar: boolean,
  amount: string
): Promise<any> => {
  const tokenCheddarContractId = getConfig().contracts.near.cheddarToken;
  const accounts = await wallet.getAccounts();
  const signerId = accounts[0].accountId;
  if (withCheddar) {
    const transactions: Transaction[] = [];
    if (BigInt(amount) > BigInt(0)) {
      // Push cheddar transfer transaction
      transactions.push({
        signerId,
        receiverId: tokenCheddarContractId,
        actions: [
          {
            type: 'FunctionCall',
            params: {
              methodName: 'ft_transfer_call',
              args: {
                receiver_id: cheddarNft,
                amount,
                msg: '',
              },
              gas: '300' + '0'.repeat(12),
              deposit: '1',
            },
          },
        ],
      });
    }
    // Push mint NFT transaction
    transactions.push({
      signerId,
      receiverId: cheddarNft,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName: 'nft_mint_one',
            args: { with_cheddar: true },
            gas: '300' + '0'.repeat(12),
            deposit: '1' + '0'.repeat(22),
          },
        },
      ],
    });
    return wallet.signAndSendTransactions({
      transactions,
    });
  } else {
    return wallet.signAndSendTransaction({
      receiverId: cheddarNft,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName: 'nft_mint_one',
            args: { with_cheddar: false },
            gas: '300' + '0'.repeat(12),
            deposit: amount,
          },
        },
      ],
    });
  }
};

export const getCheddarNFTBuyPrice = (
  withCheddar: boolean
): Promise<string> => {
  return view(cheddarNft, 'total_cost', {
    num: 1,
    // If minter is contract owner, it's free. For every other account, it has the same cost, so it can be hardcoded
    minter: 'b2a715c29af50e9cc789f92824bb5f76793acc0a12948644a498e8087e029010',
    with_cheddar: withCheddar,
  });
};

interface TokenMetadata {
  id: string;
  name: string;
  symbol: string;
  decimals: number;
  icon: string;
}

interface IServerPool {
  amount_in?: string;
  min_amount_out: string;
  pool_id: string | number;
  token_in: string;
  token_out: string;
}

interface Route {
  amount_in: string;
  min_amount_out: string;
  pools: IServerPool[];
  tokens?: TokenMetadata[];
}

const STORAGE_TO_REGISTER_WITH_MFT = '0.1';
const ONE_YOCTO_NEAR = '1';

const toNonDivisibleNumber = (decimals: number, number: string): string => {
  return new Big(number).times(new Big(10).pow(decimals)).toFixed();
};

export const swapNearToCheddar = async (
  wallet: Wallet,
  routes: Route[],
  amountIn: string
): Promise<any> => {
  const accounts = await wallet.getAccounts();
  const signerId = accounts[0].accountId;
  const { wrapNear } = getConfig().contracts.near;
  const transactions: Transaction[] = [];

  // swap to wrap.near and register if user is not registered
  const tokenRegistered = await view(wrapNear, 'storage_balance_of', {
    account_id: signerId,
  });
  if (tokenRegistered === null) {
    transactions.push({
      signerId,
      receiverId: wrapNear,
      actions: [
        {
          type: 'FunctionCall',
          params: {
            methodName: 'storage_deposit',
            args: {
              registration_only: true,
              account_id: signerId,
            },
            gas: '30000000000000',
            deposit: toNonDivisibleNumber(24, STORAGE_TO_REGISTER_WITH_MFT),
          },
        },
      ],
    });
  }

  transactions.push({
    signerId,
    receiverId: wrapNear,
    actions: [
      {
        type: 'FunctionCall',
        params: {
          methodName: 'near_deposit',
          args: {},
          gas: '50000000000000',
          deposit: toNonDivisibleNumber(24, amountIn),
        },
      },
    ],
  });

  const actionsList: any[] = [];
  routes.forEach((route) => {
    route.pools.forEach((pool) => {
      if (pool.amount_in !== undefined && +pool.amount_in == 0) {
        delete pool.amount_in;
      }
      pool.pool_id = Number(pool.pool_id);
      actionsList.push(pool);
    });
  });
  transactions.push({
    signerId,
    receiverId: wrapNear,
    actions: [
      {
        type: 'FunctionCall',
        params: {
          methodName: 'ft_transfer_call',
          args: {
            receiver_id: 'v2.ref-finance.near',
            amount: toNonDivisibleNumber(24, amountIn),
            msg: JSON.stringify({
              force: 0,
              actions: actionsList,
              referral_id: 'maze_minter_auth.cheddar.near',
            }),
          },
          gas: '180000000000000',
          deposit: ONE_YOCTO_NEAR,
        },
      },
    ],
  });

  const finalExecutionOutcomes = await wallet.signAndSendTransactions({
    transactions,
  });

  let allSucceed = true;
  finalExecutionOutcomes &&
    finalExecutionOutcomes.forEach((finalExecutionOutcome) => {
      if (!hasSuccessValue(finalExecutionOutcome.status)) {
        throw new Error('Failed to acomplish swap from contract');
      }

      allSucceed = !!finalExecutionOutcome.status.SuccessValue;
    });

  return allSucceed;
};
