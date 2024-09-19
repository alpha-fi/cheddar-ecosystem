'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import '../../public/assets/css/style.css';
import '../../public/assets/css/near.css';
import '@near-wallet-selector/modal-ui/styles.css';
import { Box, ChakraProvider, Container, VStack } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletSelectorContextProvider } from '@/contexts/WalletSelectorContext';
import { GameContextProvider } from '@/contexts/maze/GameContextProvider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Navbar from '@/components/Navbar/containers/Navbar';
import { getCheddarBalance } from '@/contracts/cheddarCalls';
import { SocialMedia } from '@/components/SocialMediaContainer';
import { PageContainer } from '@/components/PageContainer';
import DynamicWalletProvider from '@/contexts/DynamicWalletProvider';

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
        <title>Cheddar</title>
        <meta property="og:title" content="@CheddarFi" />
        <meta property="og:type" content="@CheddarFi" />
        <meta property="og:url" content="https://cheddar.farm/" />
        <meta
          property="og:image"
          content="https://github.com/user-attachments/assets/942efc37-a268-46c6-874d-bc5dc7e5b3c4"
        />

        {/* <!-- Twitter --> */}
        <meta name="twitter:title" content="@CheddarFi" />
        <meta name="twitter:text:title" content="@CheddarFi" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:description" content="A tasty world to be in" />
        <meta name="twitter:site" content="@CheddarFi" />
        <meta name="twitter:creator" content="@CheddarFi" />
        <meta
          name="twitter:image"
          content="https://github.com/user-attachments/assets/942efc37-a268-46c6-874d-bc5dc7e5b3c4"
        />
        <meta
          name="twitter:image:src"
          content="https://github.com/user-attachments/assets/942efc37-a268-46c6-874d-bc5dc7e5b3c4"
        />
      </head>
      <body className={inter.className + ' backgroundImg'}>
        <WalletSelectorContextProvider>
          <ChakraProvider>
            <QueryClientProvider client={queryClient}>
              <DynamicWalletProvider>
                <PageContainer>{children}</PageContainer>
                <ReactQueryDevtools initialIsOpen={false} />
              </DynamicWalletProvider>
            </QueryClientProvider>
          </ChakraProvider>
        </WalletSelectorContextProvider>
      </body>
    </html>
  );
}
