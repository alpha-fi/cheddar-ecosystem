'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import '../../public/assets/css/style.css';
import '../../public/assets/css/near.css';
import '@near-wallet-selector/modal-ui/styles.css';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletSelectorContextProvider } from '@/contexts/WalletSelectorContext';
import { GameContextProvider } from '@/contexts/maze/GameContextProvider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const inter = Inter({ subsets: ['latin'] });

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"
          async
        />

        <script src="/assets/js/near.js" async />
        <script src="/assets/js/script.js" async />

        <title>NEAR Checkers-(React UI Blockchain Game)</title>
      </head>
      <body className={inter.className}>
        <WalletSelectorContextProvider>
          <ChakraProvider>
            <QueryClientProvider client={queryClient}>
              {children}
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </ChakraProvider>
        </WalletSelectorContextProvider>
      </body>
    </html>
  );
}
