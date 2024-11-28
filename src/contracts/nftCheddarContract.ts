import { getConfig } from '@/configs/config';
import { Wallet, WalletSelector } from '@near-wallet-selector/core';
import { view } from './contractUtils';

export interface NFT {
  token_id: string;
  owner_id: string;
  metadata: {
    title: string;
    description: string | null;
    media: string;
    media_hash: null;
    copies: null;
    issued_at: string;
    expires_at: null;
    starts_at: null;
    updated_at: null;
    extra: null;
    reference: string;
    reference_hash: null;
  };
  approved_account_ids: Record<any, any>;
}

export class NFTCheddarContract {
  wallet: Wallet;
  contractId: string;

  constructor(wallet: Wallet) {
    this.wallet = wallet;
    const { cheddarNft } = getConfig().contracts.near;
    this.contractId = cheddarNft;
  }

  async getNFTs(accountId: string): Promise<NFT[]> {
    return view(this.contractId, 'nft_tokens_for_owner', {
      account_id: accountId,
    });
  }

  async buyNFT(withCheddar: boolean): Promise<any> {
    const tokenCheddarContractId = getConfig().contracts.near.cheddarToken;
    if (withCheddar) {
      return this.wallet.signAndSendTransactions({
        transactions: [
          {
            receiverId: tokenCheddarContractId,
            actions: [
              {
                type: 'FunctionCall',
                params: {
                  methodName: 'ft_transfer_call',
                  args: {
                    receiver_id: this.contractId,
                    amount: '7700' + '0'.repeat(24),
                    msg: '',
                  },
                  gas: '300' + '0'.repeat(12),
                  deposit: '1',
                },
              },
            ],
          },
          {
            receiverId: this.contractId,
            actions: [
              {
                type: 'FunctionCall',
                params: {
                  methodName: 'nft_mint_one',
                  args: { with_cheddar: true },
                  gas: '300' + '0'.repeat(12),
                  deposit: '1',
                },
              },
            ],
          },
        ],
      });
    } else {
      return this.wallet.signAndSendTransaction({
        receiverId: this.contractId,
        actions: [
          {
            type: 'FunctionCall',
            params: {
              methodName: 'nft_mint_one',
              args: { with_cheddar: false },
              gas: '300' + '0'.repeat(12),
              deposit: '15' + '0'.repeat(24),
            },
          },
        ],
      });
    }
  }
}
