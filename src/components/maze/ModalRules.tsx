import { getConfig } from '@/configs/config';
import { ModalContainer } from '../ModalContainer';
import { ListItem, OrderedList, UnorderedList } from '@chakra-ui/react';
import Link from 'next/link';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalRules({ isOpen, onClose }: Props) {
  const { buyCheddarInRefUrl, nadaBotUrl } = getConfig().networkData;
  return (
    <ModalContainer title={'Rules'} isOpen={isOpen} onClose={onClose}>
      Play before verifying up to 100 Cheddar🧀
      <OrderedList>
        <ListItem>Click or Tap to Start</ListItem>
        <ListItem>Navigate with Arrows or Tap</ListItem>
        <ListItem>Collect Cheddar🧀</ListItem>
        <ListItem>Battle Cartel to protect your Bag</ListItem>
        <ListItem>Find the Hidden Door🚪 to Win!</ListItem>
        <ListItem>Claim every 100 Cheddar🧀 Farmed</ListItem>
      </OrderedList>
      <br />
      Next you'll need NEAR, 555 🧀 get it on{' '}
      <Link
        href={buyCheddarInRefUrl}
        style={{ textDecoration: 'underline' }}
        target="_blank"
      >
        {' '}
        Ref
      </Link>{' '}
      and be{' '}
      <Link
        href={nadaBotUrl}
        style={{ textDecoration: 'underline' }}
        target="_blank"
      >
        Human Verified
      </Link>{' '}
      to Claim.
    </ModalContainer>
  );
}
