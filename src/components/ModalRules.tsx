import { ModalContainer } from './FeedbackModal';
import { ListItem, OrderedList, UnorderedList } from '@chakra-ui/react';
import Link from 'next/link';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalRules({ isOpen, onClose }: Props) {
  return (
    <ModalContainer title={'Rules'} isOpen={isOpen} onClose={onClose}>
      <OrderedList>
        <ListItem>Click or Tap to Start</ListItem>
        <ListItem>Navigate with Arrows or Tap</ListItem>
        <ListItem>Collect Cheddar🧀</ListItem>
        <ListItem>Battle Cartel to protect your Bag</ListItem>
        <ListItem>Find the Hidden Door🚪 to Win!</ListItem>
      </OrderedList>
    </ModalContainer>
  );
}
