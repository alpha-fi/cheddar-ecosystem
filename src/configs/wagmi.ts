import { http, cookieStorage, createConfig, createStorage } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';
import { getConfig } from './config';

export function wagmiConfig() {
  const { base } = getConfig().chains;
  return createConfig({
    chains: [base],
    connectors: [
      coinbaseWallet({
        appName: 'Chedder',
        preference: 'all',
        version: '4',
      }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [base.id]: http(),
    },
  });
}

declare module 'wagmi' {
  interface Register {
    config: ReturnType<typeof wagmiConfig>;
  }
}
