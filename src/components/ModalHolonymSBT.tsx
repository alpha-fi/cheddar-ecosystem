import { ListItem, Text, UnorderedList } from '@chakra-ui/react';
import { ModalContainer } from './ModalContainer';
import Link from 'next/link';
import { getConfig } from '@/configs/config';

interface Props {
  onClose: () => void;
  isOpen: boolean;
}
export default function ModalHolonym({ isOpen, onClose }: Props) {
  const { phoneIssuance, govIdIssuance } = getConfig().holonym;
  return (
    <ModalContainer
      isOpen={isOpen}
      onClose={onClose}
      neverCloseOnOverlayClick={true}
      title="Holonym Verification"
      hideButtons
      bgColor="#8542eb"
      border="10px solid white"
      color={'white'}
      fontSize="16px"
      fontWeight="600"
    >
      <Text>
        Verify your identity with Holonym by submitting identity documents or by
        confirming your phone number. This will allow you to receive your
        credentials.
      </Text>
      <br />
      <UnorderedList>
        <ListItem>
          <Link
            target="_blank"
            href={phoneIssuance}
            style={{ textDecoration: 'underline', color: 'white' }}
          >
            Phone Number
          </Link>
        </ListItem>
        <ListItem>
          <Link
            target="_blank"
            href={govIdIssuance}
            style={{ textDecoration: 'underline', color: 'white' }}
          >
            Government ID
          </Link>
        </ListItem>
      </UnorderedList>
      <br />
      <Text>
        Once done, select the near icon to mint the SBT to your NEAR account and
        then return here to claim your 🧀.
      </Text>
    </ModalContainer>
  );
}
