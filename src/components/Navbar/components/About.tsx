import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useState } from 'react';
import ValuesModalContent from './ValuesModalContent';
import MissionModalContent from './MissionModalContent';

export function About() {
  const [showMissionModal, setMissionModal] = useState(false);
  const [showValuesModal, setValuesModal] = useState(false);
  return (
    <>
      <ValuesModalContent
        isOpen={showValuesModal}
        onClose={() => setValuesModal(!showValuesModal)}
      />
      <MissionModalContent
        isOpen={showMissionModal}
        onClose={() => setMissionModal(!showMissionModal)}
      />
      <Menu>
        <MenuButton
          px={{ base: 2, md: 3 }}
          py={{ base: 1, md: 4 }}
          fontSize={{ base: 14, md: 16 }}
          border="1px solid #3334"
          as={Button}
          borderRadius="full"
          rightIcon={<ChevronDownIcon />}
        >
          About
        </MenuButton>
        <MenuList minWidth="auto" p="0" borderRadius="full" bg="yellowCheddar">
          <MenuItem onClick={() => setMissionModal(true)}>Vision</MenuItem>
          <MenuItem onClick={() => setValuesModal(true)}>Values</MenuItem>
        </MenuList>
      </Menu>
    </>
  );
}
