import { getConfig } from '@/configs/config';
import { ModalContainer } from '../ModalContainer';
import { ListItem, OrderedList } from '@chakra-ui/react';
import Link from 'next/link';
import { useState } from 'react';
import { ModalBuyCheddar } from '../ModalBuyCheddarRef';
import { useGlobalContext } from '@/contexts/GlobalContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalRules({ isOpen, onClose }: Props) {
  const { buyCheddarInRefUrl, nadaBotUrl } = getConfig().networkData;
  const { blockchain } = useGlobalContext();

  const [isBuyCheddarModalOpen, setBuyCheddarModal] = useState(false);

  function toggleBuyCheddarModal() {
    setBuyCheddarModal((prev) => !prev);
  }
  return (
    <ModalContainer title={'Rules'} isOpen={isOpen} onClose={onClose}>
      <ModalBuyCheddar
        onClose={toggleBuyCheddarModal}
        isOpen={isBuyCheddarModalOpen}
      />
      Play before verifying up to 100 Cheddar🧀
      <OrderedList>
        <ListItem>Click or Tap to Start</ListItem>
        <ListItem>Navigate with Arrows or Tap</ListItem>
        <ListItem>Collect Cheddar🧀</ListItem>
        <ListItem>Battle Cartel to protect your Bag</ListItem>
        <ListItem>Find the Hidden Door🚪 to Win!</ListItem>
      </OrderedList>
      <br />
      Next you'll need NEAR, 555 🧀
      {blockchain === 'near' && (
        <span>
          {' '}
          , swap your NEAR for Cheddar{' '}
          <span
            onClick={toggleBuyCheddarModal}
            style={{ textDecoration: 'underline' }}
          >
            here
          </span>{' '}
        </span>
      )}{' '}
      and be{' '}
      <Link
        href={nadaBotUrl}
        style={{ textDecoration: 'underline', color: 'inherit' }}
        target="_blank"
      >
        Human Verified
      </Link>{' '}
      to Claim.
    </ModalContainer>
  );
}
