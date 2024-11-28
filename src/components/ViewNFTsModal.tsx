import { useToast, Image, Stack } from '@chakra-ui/react';
import { ModalContainer } from './ModalContainer';
import { useWalletSelector } from '@/contexts/WalletSelectorContext';
import { useContext } from 'react';
import { getConfig } from '@/configs/config';
import { GameContext } from '@/contexts/maze/GameContextProvider';

interface Props {
  onClose: () => void;
  isOpen: boolean;
}

export const ModalViewNFTs = ({ isOpen, onClose }: Props) => {
  const { nfts } = useContext(GameContext);
  const { nftImageBaseUrl } = getConfig().networkData;

  return (
    <ModalContainer title="Your NFTs" onClose={onClose} isOpen={isOpen}>
      <Stack spacing={3}>
        {nfts.map((nft) => {
          return (
            <div>
              <Image
                src={`${nftImageBaseUrl}${nft.token_id}.png`}
                alt={`chedar nft ${nft.token_id}`}
              />
              <h3> Token {nft.token_id}</h3>
            </div>
          );
        })}
      </Stack>
    </ModalContainer>
  );
};
