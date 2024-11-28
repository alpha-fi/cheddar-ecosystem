import { ModalContainer } from '@/components/ModalContainer';
import { Flex, ListItem, Text, UnorderedList } from '@chakra-ui/react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ValuesModalContent({ isOpen, onClose }: Props) {
  return (
    <ModalContainer title={'Our Values'} isOpen={isOpen} onClose={onClose}>
      <Flex direction={'column'} justifyContent={'space-between'} gap={3}>
        <Text>
          🟠 Kindness and Collaboration: We foster a friendly and supportive
          community where everyone feels welcome, respected, and safe to
          connect, create, and collaborate without fear of negativity or
          harassment.
        </Text>
        <Text>
          🟠Vibrant Community: We believe in the power of collective action,
          empowering our community to shape the platform's future through
          transparent governance and shared decision-making. We foster a
          welcoming and collaborative environment where players connect, build
          relationships, and contribute to a vibrant social platform.
        </Text>
        <Text>
          🟠Engaging Experiences: We're passionate about creating a rewarding
          and enjoyable experience that seamlessly integrates fun gameplay,
          digital asset creation, and opportunities to shape the platform's
          future.
        </Text>
        <Text>
          🟠Creator Enablement: We envision a future where creators have the
          tools and resources to bring their visions to life and contribute to
          engaging gaming experiences within the Cheddar ecosystem.
        </Text>
        <Text>
          🟠Sustainable Ecosystem: We're committed to building a sustainable
          platform that prioritizes long-term value creation for all
          participants, fostering a vibrant and thriving GameFi economy.
        </Text>
      </Flex>
    </ModalContainer>
  );
}
