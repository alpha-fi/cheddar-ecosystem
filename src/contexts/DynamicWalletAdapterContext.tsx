import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';

import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { BitcoinWalletConnectors } from '@dynamic-labs/bitcoin';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function DynamicWalletAdapterContext({ children }: Props) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: 'def5675d-a668-4907-885f-832e7e011db8',
        walletConnectors: [EthereumWalletConnectors, BitcoinWalletConnectors],
      }}
    >
      {children}
    </DynamicContextProvider>
  );
}
