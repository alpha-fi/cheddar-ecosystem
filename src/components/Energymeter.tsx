import {
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Progress,
  ProgressLabel,
} from '@chakra-ui/react';
import React, { useState } from 'react';

interface Props {
  type?: 'hBar' | 'labeledBar' | 'circular' | 'labeledCircular';
  barSize?: 'sm' | 'md' | 'lg';
  circularSize?: string;
  circularThickness?: string;
  color?: string;
  style?: Object;
  labelStyle?: Object;
}

export const Energymeter = ({
  type = 'hBar',
  barSize = 'lg',
  circularSize = '20px',
  circularThickness = '12px',
  color = 'purple',
  style = {
    border: '1px solid black',
    borderRadious: '12px',
    width: '100%',
  }, // In type 'circular' it's recomended to pass an empty object as default
  labelStyle = {
    fontSize: 'small',
    color: 'black',
  },
}: Props) => {
  const [percentage, setPercentage] = useState(80);

  return (
    <Flex alignItems={'center'} gap={'0.5rem'} w={'90%'} margin={'0 auto'}>
      <p>Energy:</p>
      {type === 'hBar' && (
        <Progress
          value={percentage}
          colorScheme={color}
          style={style}
          size={barSize}
        />
      )}
      {type === 'labeledBar' && (
        <Progress
          value={percentage}
          colorScheme={color}
          style={style}
          size={barSize}
        >
          <ProgressLabel style={labelStyle}>{percentage}%</ProgressLabel>
        </Progress>
      )}
      {type === 'circular' && (
        <CircularProgress
          color={color}
          value={percentage}
          size={circularSize}
          thickness={circularThickness}
          style={style}
        />
      )}
      {type === 'labeledCircular' && (
        <CircularProgress
          color={color}
          value={percentage}
          size={circularSize}
          thickness={circularThickness}
          style={style}
        >
          <CircularProgressLabel style={labelStyle}>
            {percentage}
          </CircularProgressLabel>
        </CircularProgress>
      )}
    </Flex>
  );
};
