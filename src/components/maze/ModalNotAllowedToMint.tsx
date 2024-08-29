import { ModalContainer } from '../ModalContainer';
import styles from '@/styles/ModalNotAllowedToPlay.module.css';
import { getConfig } from '@/configs/config';
import { useState } from 'react';
import { Link } from '@chakra-ui/react';
import ModalHolonym from '../ModalHolonymSBT';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  earnedButNotMintedCheddar: number;
}

export default function ModalNotAllowedToMint({
  isOpen,
  onClose,
  earnedButNotMintedCheddar,
}: Props) {
  const { networkData } = getConfig();
  const [showHolonymModal, setHolonymModal] = useState(false);

  return (
    <ModalContainer
      title={'Ups! You cannot claim'}
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalHolonym
        isOpen={showHolonymModal}
        onClose={() => setHolonymModal(false)}
      />
      Please verify on{' '}
      <Link
        className={styles.link}
        href={networkData.nadaBotUrl}
        target="_blank"
        style={{ textDecoration: 'underline' }}
      >
        Nadabot
      </Link>{' '}
      or{' '}
      <Link
        onClick={() => setHolonymModal(true)}
        style={{ textDecoration: 'underline' }}
        target="_blank"
      >
        Holonym
      </Link>
      <span> to claim your pending {earnedButNotMintedCheddar} 🧀</span>
    </ModalContainer>
  );
}
