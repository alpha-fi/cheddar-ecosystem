import { ModalContainer } from './FeedbackModal';
import { ListItem, UnorderedList } from '@chakra-ui/react';
import Link from 'next/link';
import styles from '../styles/ModalNotAllowedToPlay.module.css'

interface Props {
  // errors: string[];
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalNotAllowedToPlay({
  // errors,
  isOpen,
  onClose,
}: Props) {
  const renderError = (error: string) => {
    switch (error) {
      case 'blacklist':
        return <ListItem>You have been banned</ListItem>;
      case 'nadabot':
        return (
          <ListItem>
            <span>You must been validated by </span>
            <Link className={styles.link} href="http://www.nada.bot">
              nada.bot
            </Link>
            <span> to play</span>
          </ListItem>
        );
      default:
        return <></>;
    }
  };

  const testErrors = ["nadabot"]

  return (
    <ModalContainer
      title={'Ups! You cannot play'}
      isOpen={isOpen}
      onClose={onClose}
    >
      <UnorderedList>{testErrors.map(renderError)}</UnorderedList>
    </ModalContainer>
  );
}
