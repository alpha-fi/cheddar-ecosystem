import { useEffect, useRef, useState } from 'react';
import { ModalContainer } from './ModalContainer';
import { HStack, Image, Text } from '@chakra-ui/react';
import { useGlobalContext } from '@/contexts/GlobalContext';

export const WeHaveMusicModal = () => {
  const [showWeHaveMusicModal, setShowWeHaveMusicModal] = useState(false);

  const { setForcePlayMusic } = useGlobalContext();

  const weHaveMusicModalWasShown = useRef(
    localStorage.getItem('weHaveMusicModalWasShown')
  ).current;

  const welcomeModalWasShown = useRef(
    localStorage.getItem('welcomeModalWasShown')
  ).current;

  useEffect(() => {
    if (welcomeModalWasShown === 'true' && weHaveMusicModalWasShown === null) {
      setShowWeHaveMusicModal(true);
      localStorage.setItem('weHaveMusicModalWasShown', 'true');
    }
  }, []);

  function handleCloseWeHaveMusicModal() {
    setForcePlayMusic(true);
    setShowWeHaveMusicModal(false);
  }

  return (
    <ModalContainer
      isOpen={showWeHaveMusicModal}
      onClose={handleCloseWeHaveMusicModal}
      neverCloseOnOverlayClick={true}
      title=""
      hideButtons
      bgColor="#8542eb"
      border="10px solid white"
      color={'white'}
      fontSize="16px"
      fontWeight="600"
    >
      <Image
        src="assets/cheddar-logo.png"
        alt="cheddar logo with text"
        mb="30px"
      />
      <Text>
        We have music! You can play/pause it with the button in the nav bar on
        top.
      </Text>
      <HStack justifyContent="space-between">
        <Text alignSelf="start">- We hope you enjoy it!</Text>
        <Image src="assets/cheddar-mouse.png" alt="cheddar mouse" w="120px" />
      </HStack>
    </ModalContainer>
  );
};
