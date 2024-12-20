import { Box, Container, useToast, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import Navbar from './Navbar/containers/Navbar';
import { SocialMedia } from './SocialMediaContainer';
import { GameContextProvider } from '@/contexts/maze/GameContextProvider';
import { useGlobalContext } from '@/contexts/GlobalContext';

export const PageContainer = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <GameContextProvider>
      <VStack minH="100%" minW="100%" justifyContent="space-between">
        <Box minW="100%">
          <Navbar />
          <Container maxW="1280px">{children}</Container>
        </Box>
        <Box display={{ base: 'none', lg: 'contents' }}>
          <SocialMedia />
        </Box>
      </VStack>
    </GameContextProvider>
  );
};
