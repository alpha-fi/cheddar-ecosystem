import { Wallet, WalletSelector } from '@near-wallet-selector/core';
import { WalletSelectorModal } from '@near-wallet-selector/modal-ui';
import { createStore } from 'zustand/vanilla';

export interface WalletStore {
  selector: WalletSelector | null;
  modal: WalletSelectorModal | null;
  account_id: string | null;
  wallet: Wallet | null;
}

export const store = createStore<WalletStore>(() => ({
  selector: null,
  modal: null,
  account_id: null,
  wallet: null,
}));
