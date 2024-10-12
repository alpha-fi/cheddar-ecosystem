'use client';
import { ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from '../configs/wagmi';

type Props = { children: ReactNode };

function WagmiContextProvider({ children }: Props) {
  const [config] = useState(() => wagmiConfig());

  return <WagmiProvider config={config}>{children}</WagmiProvider>;
}

export default WagmiContextProvider;
