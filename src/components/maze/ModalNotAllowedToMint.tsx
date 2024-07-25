import { ModalContainer } from '../ModalContainer';
import Link from 'next/link';
import styles from '@/styles/ModalNotAllowedToPlay.module.css';
import { getConfig } from '@/configs/config';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pendingCheddarToMint: number;
}

export default function ModalNotAllowedToMint({
  isOpen,
  onClose,
  pendingCheddarToMint,
}: Props) {
  const { networkData } = getConfig();

  return (
    <ModalContainer
      title={'Ups! You cannot claim'}
      isOpen={isOpen}
      onClose={onClose}
    >
      Please verify on{' '}
      <Link
        className={styles.link}
        href={networkData.nadaBotUrl}
        target="_blank"
      >
        nada.bot
      </Link>
      <span> to claim your pending {pendingCheddarToMint} 🧀</span>
    </ModalContainer>
  );
}
