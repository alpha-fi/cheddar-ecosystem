import { ModalContainer } from '@/components/ModalContainer';
import { ListItem, Text, UnorderedList } from '@chakra-ui/react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ValuesModalContent({ isOpen, onClose }: Props) {
  return (
    <ModalContainer title={'Our Values'} isOpen={isOpen} onClose={onClose}>
      <UnorderedList fontSize="14px">
        <ListItem>
          <Text as="b" fontSize="md">
            Every Human Welcome:
          </Text>{' '}
          We, the Cheddar community, celebrate the power of human interaction.
          Our platform welcomes everyone to connect, create, and collaborate.
        </ListItem>
        <ListItem>
          <Text as="b" fontSize="md">
            Fun & Engaging:
          </Text>{' '}
          Together, we make Web3 enjoyable and accessible through gamified
          experiences, playful interactions, and a vibrant community that values
          kindness and collaboration.
        </ListItem>
        <ListItem>
          <Text as="b" fontSize="md">
            Enabling Creators:
          </Text>{' '}
          We provide tools and resources for creators to build and share their
          unique visions, fostering a thriving and equitable creator ecosystem.
        </ListItem>
        <ListItem>
          <Text as="b" fontSize="md">
            Community-Driven:
          </Text>{' '}
          We believe in the power of collective action, giving our community a
          voice in shaping a transparent platform that benefits all.
        </ListItem>
        <ListItem>
          <Text as="b" fontSize="md">
            Sustainable Growth:
          </Text>{' '}
          We are committed to building a sustainable Web3 ecosystem that
          prioritizes long-term value creation for all human contributors.
        </ListItem>
      </UnorderedList>
    </ModalContainer>
  );
}
