import { Box, HStack, useRadio, useRadioGroup } from '@chakra-ui/react';
import { isCurrentBrowserSupported } from '@near-wallet-selector/core';

export const RadioCard = (props: any) => {
  const { getInputProps, getRadioProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getRadioProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        userSelect="none"
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        background={props.optionSelected === props.children ? '#ECC94B' : ''}
        _checked={{
          bg: 'teal.600',
          color: 'white',
          borderColor: 'teal.600',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
};

export const RadioButtonBroup = (props: any) => {
  const { options, optionSelected, setOptionSelected } = props;
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'framework',
    defaultValue: 'react',
  });

  const group = getRootProps();

  return (
    <HStack {...group}>
      {options.map((option: any) => {
        const { name } = option;
        const radio = getRadioProps({ name });
        function onChange() {
          setOptionSelected(name);
        }

        return (
          <RadioCard
            key={name}
            {...radio}
            optionSelected={optionSelected}
            onChange={onChange}
          >
            {name}
          </RadioCard>
        );
      })}
    </HStack>
  );
};
