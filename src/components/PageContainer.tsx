import { Box, Container, VStack } from '@chakra-ui/react';
import React from 'react';
import Navbar from './Navbar/containers/Navbar';
import { SocialMedia } from './SocialMediaContainer';
import { GameContextProvider } from '@/contexts/maze/GameContextProvider';

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
