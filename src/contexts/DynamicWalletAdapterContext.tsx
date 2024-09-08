import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';

import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { BitcoinWalletConnectors } from '@dynamic-labs/bitcoin';
import { ZeroDevSmartWalletConnectors } from '@dynamic-labs/ethereum-aa';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function DynamicWalletAdapterContext({ children }: Props) {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: 'ebc8f60c-7ac4-46f4-a077-0373f46231d0',
        walletConnectors: [
          EthereumWalletConnectors,
          BitcoinWalletConnectors,
          ZeroDevSmartWalletConnectors,
        ],
      }}
    >
      {children}
    </DynamicContextProvider>
  );
}
