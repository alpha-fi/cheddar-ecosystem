import { getConfig } from '@/configs/config';
import { ModalContainer } from '../FeedbackModal';
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
        <ListItem>Click the position you want to drop the ball in.</ListItem>
        <ListItem>
          If a ball get's stuck use the "Hit machine" button until the ball
          get's unstucked.
        </ListItem>
        <ListItem>
          The more balls end up in the same goal, the more cheddar you
          accumulate!
        </ListItem>
        <ListItem>
          The game end's when every ball is on the bottom. You can keep
          exploring the maze then.
        </ListItem>
      </OrderedList>
    </ModalContainer>
  );
}
