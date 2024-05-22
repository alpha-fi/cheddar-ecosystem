import { ListItem, UnorderedList, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

interface Props {
  errors: string[];
}

const renderError = (error: string) => {
  switch (error) {
    case 'blacklist':
      return <ListItem>You have been banned</ListItem>;
    case 'nadabot':
      return (
        <ListItem>
          You must been validated by{' '}
          <Link as={NextLink} href="nada.bot">
            nada.bot
          </Link>
        </ListItem>
      );
    default:
      return <></>;
  }
};

export const RenderIsAllowedErrors = ({ errors }: Props) => {
  return <UnorderedList>{errors.map(renderError)}</UnorderedList>;
};
