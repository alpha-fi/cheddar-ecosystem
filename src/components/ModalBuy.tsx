import { ModalContainer } from './ModalContainer';
import { useEffect, useRef, useState } from 'react';

import { BuyNFTTab } from './BuyNFTTab';
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
} from '@chakra-ui/react';
import { useGlobalContext } from '@/contexts/GlobalContext';

interface Props {
  onClose: () => void;
  isOpen: boolean;
  handleBuyClick: () => void;
}

interface TabData {
  tabName: 'buyMatch' | 'buyNFT';
  title: string;
  JSX: JSX.Element;
}

interface TabProps {
  tab: TabData;
  index: number;
}

export const ModalBuy = ({ isOpen, onClose, handleBuyClick }: Props) => {
  const variant = useRef([
    'line',
    'enclosed',
    'enclosed-colored',
    'soft-rounded',
    'solid-rounded',
  ]).current;

  const { addresses, blockchain } = useGlobalContext();

  const [vIndex, setVIndex] = useState(0);
  const [v, setV] = useState(variant[vIndex]);

  useEffect(() => {
    setTimeout(() => {
      if (isOpen) {
        const newVIndex = variant.length > vIndex + 1 ? vIndex + 1 : 0;
        setVIndex(newVIndex);
        console.log(variant[vIndex]);

        setV(variant[vIndex]);
      }
    }, 4000);
  }, [v, vIndex, isOpen]);

  const tabsData = useRef<TabData[]>([
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

  const CustomTab = ({ tab, index }: TabProps) => {
    return (
      <Tab
        sx={{
          _selected: { color: 'white', backgroundColor: '#ffd262' },
          backgroundColor: 'rgba(255, 210, 98, 0.66)',
          color: '#555',
          borderColor: '#f9ba37',
          _disabled: { color: 'black', backgroundColor: '#555' },
        }}
        key={`buy-tab-title-${index}`}
        isDisabled={
          blockchain !== 'near' &&
          typeof addresses['near'] === 'string' &&
          tab.tabName === 'buyNFT'
        }
      >
        {tab.title}
      </Tab>
    );
  };

  return (
    <ModalContainer title={''} onClose={onClose} isOpen={isOpen}>
      <Tabs variant={v}>
        <TabList sx={{ borderColor: '#f9ba37' }}>
          {tabsData.map((tab, index) =>
            typeof addresses['near'] === 'string' &&
            tab.tabName === 'buyNFT' ? (
              <Tooltip
                label={
                  blockchain !== 'near'
                    ? 'Must be in NEAR blockchain to buy'
                    : 'Cheddy PowerUp boosts 🧀 and wins'
                }
              >
                {/* This div tag must exist so the tooltip get shown */}
                <div>
                  <CustomTab tab={tab} index={index} />
                </div>
              </Tooltip>
            ) : (
              <CustomTab tab={tab} index={index} />
            )
          )}
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