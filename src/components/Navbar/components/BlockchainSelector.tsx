import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button, Circle, HStack, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { useGlobalContext } from '@/contexts/GlobalContext';

export function BlockchainSelector() {
  const {blockchain, setBlockchain, addresses} = useGlobalContext()
  return (
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
        {blockchain.toLocaleUpperCase()} 
      </MenuButton>
      <MenuList minWidth="auto" p="0" borderRadius="full" bg="yellowCheddar">
        <MenuItem onClick={() => setBlockchain('near')}>
          <HStack>
            <Text>Near</Text>
            <Circle size={"9px"} bg={addresses["near"] ? "#00D26D" : "#7D8491"}></Circle>
          </HStack>
        </MenuItem>
        <MenuItem onClick={() => setBlockchain('base')}>
          <HStack>
            <Text>Base</Text>
            <Circle size={"9px"} bg={addresses["base"] ? "#00D26D" : "#7D8491"}></Circle>
          </HStack>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
