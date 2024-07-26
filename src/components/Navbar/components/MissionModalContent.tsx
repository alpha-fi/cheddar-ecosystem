import { ModalContainer } from '@/components/ModalContainer';
import { ListItem, Text, UnorderedList } from '@chakra-ui/react';
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function MissionModalContent({ isOpen, onClose }: Props) {
  return (
    <ModalContainer title={'Our Mission'} isOpen={isOpen} onClose={onClose}>
      <UnorderedList fontSize="14px">
        <ListItem>
          <Text as="b" fontSize="md">
            Creativity Flourishes:
          </Text>{' '}
          Individuals and communities are empowered unleash their creativity and
          build unique experiences.
        </ListItem>
        <ListItem>
          <Text as="b" fontSize="md">
            Connections Matter:
          </Text>{' '}
          People come together to collaborate, share ideas, and form meaningful
          relationships that enrich their lives.
        </ListItem>
        <ListItem>
          <Text as="b" fontSize="md">
            Everyone Belongs:
          </Text>{' '}
          Inclusivity is the norm, and everyone has the opportunity to
          participate, contribute, and benefit from the Web3 ecosystem.
        </ListItem>
      </UnorderedList>
    </ModalContainer>
  );
}
