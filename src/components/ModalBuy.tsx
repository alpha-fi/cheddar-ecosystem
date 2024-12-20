import { ModalContainer } from './ModalContainer';
import { useRef } from 'react';

import { BuyNFTTab } from './BuyNFTTab';
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
} from '@chakra-ui/react';
import { BuyMatchTab } from './BuyMatchTab';

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
  const tabsData = useRef<TabData[]>([
    {
      tabName: 'buyMatch',
      title: 'Game',
      JSX: <BuyMatchTab />,
    },
    {
      tabName: 'buyNFT',
      title: 'NFT',
      JSX: <BuyNFTTab isOpen={isOpen} />,
    },
  ]).current;

  const TabWithToolTip = ({ tab, index }: TabProps) => {
    return (
      <Tooltip label={'Cheddy PowerUp boosts 🧀 and wins'}>
        <CustomTab tab={tab} index={index}></CustomTab>
      </Tooltip>
    );
  };

  const CustomTab = ({ tab, index }: TabProps) => {
    return (
      <Tab
        sx={{
          _selected: { color: 'white', backgroundColor: '#ffd262' },
          backgroundColor: 'rgba(255, 210, 98, 0.66)',
          color: '#555',
          borderColor: '#f9ba37',
          _disabled: { color: 'black', backgroundColor: '#555' },
          width: `${100 / tabsData.length}%`,
        }}
        key={`buy-tab-title-${index}`}
      >
        {tab.title}
      </Tab>
    );
  };

  return (
    <ModalContainer title={''} onClose={onClose} isOpen={isOpen}>
      <Tabs variant={'line'}>
        <TabList sx={{ borderColor: '#f9ba37' }}>
          {tabsData.map((tab, index) =>
            tab.tabName === 'buyNFT' ? (
              <TabWithToolTip tab={tab} index={index} />
            ) : (
              <CustomTab tab={tab} index={index} />
            )
          )}
        </TabList>

        <TabPanels
          sx={{ backgroundColor: '#9d67ef', borderRadius: '0px 0px 10px 10px' }}
        >
          {tabsData.map((tab, index) => (
            <TabPanel key={`buy-tab-content-${index}`}>{tab.JSX}</TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </ModalContainer>
  );
};
