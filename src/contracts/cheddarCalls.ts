import { getConfig } from '@/configs/config';
import { view } from './contractUtils';
import { Metadata } from './CheddarToken';
import { NFT } from './nftCheddarContract';
import { Transaction, Wallet } from '@near-wallet-selector/core';

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

export const getCheddarBalance = async (accountId: string): Promise<bigint> => {
  return view(cheddarToken, tokenViewMethods.ftBalanceOf, {
    account_id: accountId,
  }).then(BigInt);
};

export const getNFTCheddarBalance = async (accountId: string): Promise<NFT[]> => {
  return view(cheddarNft, "balance_of", {
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
  const accounts = await wallet.getAccounts()
  const signerId = accounts[0].accountId;
  if (withCheddar) {
    const transactions: Transaction[] = []
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
      },)
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
    },
    )
    return wallet.signAndSendTransactions({
      transactions
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
