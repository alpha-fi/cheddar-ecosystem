import { Box, Container, VStack } from '@chakra-ui/react';
import React from 'react';
import Navbar from './Navbar/containers/Navbar';
import { SocialMedia } from './SocialMediaContainer';

export const PageContainer = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <VStack minH="100%" minW="100%" justifyContent="space-between">
      <Box minW="100%">
        <Navbar />
        <Container maxW="1280px">{children}</Container>
      </Box>
      <SocialMedia />
    </VStack>
  );
};
