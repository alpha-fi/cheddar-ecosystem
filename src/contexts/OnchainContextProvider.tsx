'use client';
import { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base, baseSepolia } from 'viem/chains';

type Props = { children: ReactNode };

function OnchainContextProvider({ children }: Props) {
  return (
    <OnchainKitProvider
      apiKey={'M38cgIFQVu6ldPK0gob81k2_LblbB3jq'}
      chain={baseSepolia}
    >
      {children}
    </OnchainKitProvider>
  );
}

export default OnchainContextProvider;
