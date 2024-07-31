import { Box, Img, VStack } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import React, { useMemo } from 'react';
import { RenderCheddarIcon } from '../maze/RenderCheddarIcon';
import styles from '@/styles/Door.module.css';

const animationKeyframesTop = (
  skewYDeg: number,
  primaryColor: string,
  shadowColor: string
) => keyframes`
  0% { transform:rotateY(0deg) skewY(0deg); transform-origin: 0% 0%;}
  100% { transform:rotateY(-90deg) skewY(${skewYDeg}deg); transform-origin: 0% 0%; background-color:${shadowColor}}
`;

const animationCenter = `${animationKeyframesTop(0, '#bfa380', '#8f7350')} ${'1s linear'}`;
const animationTop = `${animationKeyframesTop(10, '#bfa380', '#8f7350')} ${'1s linear'}`;
const animationBottom = `${animationKeyframesTop(-10, '#bfa380', '#8f7350')} ${'1s linear'}`;

interface Props {
  index: number;
  handleSelectDoor: any;
  actionAfterAnimation: any;
  selectedDoor: {
    index: number | null;
    priceImagePath: string;
    prizeValue: number;
  };
  keepDoorOpen: boolean;
}

export const Door = ({
  index,
  handleSelectDoor,
  actionAfterAnimation,
  selectedDoor,
  keepDoorOpen,
}: Props) => {
  const showAnimation = useMemo(
    () => selectedDoor.index === index && selectedDoor.priceImagePath,
    [selectedDoor.index, selectedDoor.priceImagePath]
  );

  function getPropperStyles() {
    if (selectedDoor.prizeValue > 0) {
      return styles.win;
    }
    return styles.lost;
  }

  return (
    <VStack
      position="relative"
      spacing={0}
      border="8px solid #7a6857"
      borderTopColor="#6b5b4b"
      borderBottom={0}
      w="100%"
      h="100%"
      cursor={selectedDoor.index === null ? 'pointer' : undefined}
      onClick={handleSelectDoor}
    >
      <Box
        animation={showAnimation ? animationTop : undefined}
        // className={keepDoorOpen ? styles.doorOpened : ""}
        backgroundColor="#bfa380"
        style={{animationFillMode: "forwards"}}
        h="10px"
        w={'100%'}
        id="top"
      ></Box>
      <Box
        animation={showAnimation ? animationCenter : undefined}
        // className={keepDoorOpen ? styles.doorOpened : ""}
        onAnimationEnd={actionAfterAnimation}
        backgroundColor="#bfa380"
        w="100%"
        h="100%"
        style={{animationFillMode: "forwards"}}
        >
        <Img w="100}%" src={'assets/transparent-door.svg'} />
      </Box>
      <Box
        animation={showAnimation ? animationBottom : undefined}
        // className={keepDoorOpen ? styles.doorOpened : ""}
        backgroundColor="#bfa380"
        style={{animationFillMode: "forwards"}}
        h="10px"
        w={'100%'}
        id="bottom"
      ></Box>
      <VStack
        position="absolute"
        h="100%"
        w="100%"
        justifyContent="center"
        alignItems="center"
        zIndex={-1}
      >
        {selectedDoor.prizeValue > 0 ? (
          <span className={getPropperStyles()}>
            {selectedDoor.prizeValue} 🧀
          </span>
        ) : (
          <Img w={`80%`} src={selectedDoor.priceImagePath} />
        )}
      </VStack>
    </VStack>
  );
};
