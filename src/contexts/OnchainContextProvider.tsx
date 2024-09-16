'use client';
import { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'viem/chains';

import { getConfig } from '@/configs/config';

type Props = { children: ReactNode };

function OnchainContextProvider({ children }: Props) {
  return (
    <OnchainKitProvider apiKey={getConfig().onchainkit?.api} chain={base}>
      {children}
    </OnchainKitProvider>
  );
}

export default OnchainContextProvider;
