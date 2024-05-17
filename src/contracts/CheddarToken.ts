import { getConfig } from '@/configs/config';
import { Wallet, WalletSelector } from '@near-wallet-selector/core';
import { view } from './contractUtils';

export interface Metadata {
  spec: string;
  name: string;
  symbol: string;
  icon: string;
  reference: null;
  reference_hash: null;
  decimals: number;
}

export class CheddarToken {
  wallet: Wallet;
  contractId: string;

  constructor(wallet: Wallet) {
    this.wallet = wallet;
    const { cheddarToken } = getConfig().contracts;
    this.contractId = cheddarToken;
  }

  async getBalance(accountId: string): Promise<bigint> {
    return view(this.contractId, 'ft_balance_of', {
      account_id: accountId,
    }).then(BigInt);
  }

  async getMetadata(): Promise<Metadata> {
    return view(this.contractId, 'ft_metadata');
  }
}
