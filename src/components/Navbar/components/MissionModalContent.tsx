import { ModalContainer } from '@/components/ModalContainer';
import { Flex, ListItem, Text, UnorderedList } from '@chakra-ui/react';
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function MissionModalContent({ isOpen, onClose }: Props) {
  return (
    <ModalContainer title={'Our Vision'} isOpen={isOpen} onClose={onClose}>
      <Flex direction={'column'} justifyContent={'space-between'} gap={3}>
        <Text>
          🟠 We're creating a rewarding and engaging gaming experience that
          integrates fun gameplay, digital assets, and a thriving in-game
          economy governed by the collective voice of our community.
        </Text>
        <Text>
          🟠We envision a creative and open play-to-earn economy where people
          play, collect, and collaborate to build a vibrant social GameFi
          platform.
        </Text>
        <Text>
          🟠We're building towards a future where players, creators, and brands
          collaborate to build unique and engaging experiences within the
          Cheddar ecosystem.
        </Text>
      </Flex>
    </ModalContainer>
  );
}
