import { ModalContainer } from './ModalContainer';
import { MouseEvent, useRef, useState } from 'react';
import { RenderCheddarIcon } from './maze/RenderCheddarIcon';
import { RenderNearIcon } from './maze/RenderNearIcon';

import { useGetCheddarNFTPrice } from '@/hooks/cheddar';
import { yton } from '@/contracts/contractUtils';
import { BuyNFTTab } from './BuyNFTTab';

interface Props {
  onClose: () => void;
  isOpen: boolean;
  handleBuyClick: () => void;
}

export const ModalBuy = ({ isOpen, onClose, handleBuyClick }: Props) => {
  const tabsData = useRef([
    {
      tabName: 'buyMatch',
      title: 'Buy maze match',
      JSX: <></>,
    },
    {
      tabName: 'buyNFT',
      title: 'Buy Cheddar NFT',
      JSX: <BuyNFTTab isOpen={isOpen} />,
    },
  ]).current;

  function handleTabClick(e: MouseEvent, tabName: string) {
    return () => {
      e.preventDefault();
      console.log('click');
    };
  }

  return (
    <ModalContainer title={''} onClose={onClose} isOpen={isOpen}>
      <Tabs>
        <TabList>
          {tabsData.map((tab, index) => (
            <Tab
              key={`buy-tab-title-${index}`}
              onClick={(e) => handleTabClick(e, tab.tabName)}
            >
              {tab.title}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          {tabsData.map((tab, index) => (
            <TabPanel key={`buy-tab-content-${index}`}>{tab.JSX}</TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </ModalContainer>
  );
};
