import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useWalletSelector } from './WalletSelectorContext';
import { coinbaseWallet } from 'wagmi/connectors';
import {
  useGetCheddarBalance,
  useGetCheddarBaseBalance,
  useGetCheddarBaseTotalSupply,
  useGetCheddarNearTotalSupply,
  useGetCheddarNFTs,
  useIsHolonymVerfified,
  useIsNadabotVerfified,
} from '@/hooks/cheddar';
import { NFT } from '@/contracts/nftCheddarContract';

export type Blockchain = 'base' | 'near';

interface GlobalContextProps {
  setBlockchain: React.Dispatch<React.SetStateAction<Blockchain>>;
  blockchain: Blockchain;
  blockchainChangedOnLoad: boolean;
  setBlockchainChangedOnLoad: React.Dispatch<React.SetStateAction<boolean>>;
  forcePlayMusic: boolean;
  setForcePlayMusic: React.Dispatch<React.SetStateAction<boolean>>;
  forcePauseMusic: boolean;
  setForcePauseMusic: React.Dispatch<React.SetStateAction<boolean>>;
  addresses: {
    [key: string]: string | null;
    near: string | null;
    base: string | null;
  };
  selectedBlockchainAddress: string | null;
  showConnectionModal: () => void;
  disconnectWallet: () => void;
  cheddarBalance: any;
  isCheddarBalanceLoading: boolean;
  refreshCheddarBalance: () => void;
  cheddarTotalSupply: any;
  isCheddarTotalSupplyLoading: boolean;
  isConnected: boolean;
  isUserVerified: boolean | undefined;
  collapsableNavbar: boolean;
  toggleCollapsableNavbar: () => void;
  collapsableNavbarActivated: boolean;
  setCollapsableNavbarActivated: React.Dispatch<React.SetStateAction<boolean>>;
  cheddarNFTsData: NFT[] | null | undefined;
  isLoadingCheddarNFTs: boolean;
}

const GlobalContext = React.createContext({} as GlobalContextProps);

export const GlobalContextProvider: any = ({ children }: any) => {
  const [blockchain, setBlockchain] = useState<Blockchain>('base');
  const [blockchainChangedOnLoad, setBlockchainChangedOnLoad] = useState(false);

  const { data: cheddarNFTsData, isLoading: isLoadingCheddarNFTs } =
    useGetCheddarNFTs();

  const [forcePlayMusic, setForcePlayMusic] = useState(false);
  const [forcePauseMusic, setForcePauseMusic] = useState(false);
  const { accountId: nearAddress, selector, modal } = useWalletSelector();
  const { address: evmAddress, isConnected: isBaseConnected } = useAccount();
  const [collapsableNavbarActivated, setCollapsableNavbarActivated] =
    useState(false);
  const [collapsableNavbar, setCollapsableNavbar] = useState(false);
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const {
    data: cheddarBaseBalance,
    isLoading: isLoadingCheddarBaseBalance,
    refetch: refreshCheddarBalance,
  } = useGetCheddarBaseBalance();
  const {
    data: cheddarNearBalance,
    isLoading: isLoadingCheddarNearBalance,
    refetch: refreshCheddarBalance,
  } = useGetCheddarBalance();

  const {
    data: cheddarNearTotalSupply,
    isLoading: isLoadingCheddarNearTotalSupply,
  } = useGetCheddarNearTotalSupply();
  const {
    data: cheddarBaseTotalSupply,
    isLoading: isLoadingCheddarBaseTotalSupply,
  } = useGetCheddarBaseTotalSupply();
  const { data: isUserNadabotVerified } = useIsNadabotVerfified(nearAddress);
  const { data: isUserHolonymVerified } = useIsHolonymVerfified(nearAddress);

  const showConnectionModal = useMemo(() => {
    switch (blockchain) {
      case 'near':
        return modal.show;
      case 'base':
        return () => connect({ connector: coinbaseWallet() });
    }
  }, [blockchain]);

  function toggleCollapsableNavbar() {
    setCollapsableNavbar(!collapsableNavbar);
  }

  const disconnectWallet = useMemo(() => {
    switch (blockchain) {
      case 'near':
        return () => selector.wallet().then((wallet) => wallet.signOut());
      case 'base':
        return () => disconnect();
    }
  }, [blockchain]);

  const addresses = useMemo(() => {
    return {
      near: nearAddress || null,
      base: evmAddress || null,
    };
  }, [nearAddress, evmAddress, blockchain]);

  const selectedBlockchainAddress = useMemo(
    () => addresses[blockchain],
    [addresses, blockchain]
  );

  const cheddarBalance = useMemo(() => {
    switch (blockchain) {
      case 'near':
        return cheddarNearBalance;
      case 'base':
        return cheddarBaseBalance;
    }
  }, [blockchain, cheddarNearBalance, cheddarBaseBalance]);

  const cheddarTotalSupply = useMemo(() => {
    return cheddarBaseTotalSupply !== undefined &&
      cheddarNearTotalSupply !== undefined
      ? (cheddarBaseTotalSupply as bigint) + cheddarNearTotalSupply
      : BigInt(0);
  }, [cheddarBaseTotalSupply, cheddarNearTotalSupply]);

  const isCheddarBalanceLoading = useMemo(() => {
    switch (blockchain) {
      case 'near':
        return isLoadingCheddarNearBalance;
      case 'base':
        return isLoadingCheddarBaseBalance;
    }
  }, [blockchain, isLoadingCheddarNearBalance, isLoadingCheddarBaseBalance]);

  const isCheddarTotalSupplyLoading = useMemo(
    () => isLoadingCheddarNearTotalSupply && isLoadingCheddarBaseTotalSupply,
    [
      blockchain,
      isLoadingCheddarNearTotalSupply,
      isLoadingCheddarBaseTotalSupply,
    ]
  );

  const isConnected = useMemo(() => {
    switch (blockchain) {
      case 'near':
        return selector.isSignedIn();
      case 'base':
        return isBaseConnected;
    }
  }, [blockchain, nearAddress, isBaseConnected]);

  const isUserVerified = useMemo(() => {
    switch (blockchain) {
      case 'near':
        return isUserNadabotVerified || isUserHolonymVerified;
      case 'base':
        return true;
    }
  }, [blockchain, isUserNadabotVerified, isUserHolonymVerified]);

  useEffect(() => {
    if (!blockchainChangedOnLoad) {
      // For some reason when you enter the site you get addresses.near but not addresses.base
      // That's the reason of why i use the setTimeout
      if (!addresses.base && addresses.near) {
        setBlockchain('near');
        setTimeout(() => {
          setBlockchainChangedOnLoad(true);
        }, 500);
      } else {
        setBlockchain('base');
        setTimeout(() => {
          setBlockchainChangedOnLoad(true);
        }, 500);
      }
    }
  }, [addresses, addresses.base, addresses.near]);

  return (
    <GlobalContext.Provider
      value={{
        setBlockchain,
        blockchain,
        forcePlayMusic,
        setForcePlayMusic,
        forcePauseMusic,
        setForcePauseMusic,
        addresses,
        selectedBlockchainAddress,
        showConnectionModal,
        disconnectWallet,
        cheddarBalance,
        isCheddarBalanceLoading,
        cheddarTotalSupply,
        isCheddarTotalSupplyLoading,
        isConnected,
        isUserVerified,
        collapsableNavbar,
        toggleCollapsableNavbar,
        collapsableNavbarActivated,
        setCollapsableNavbarActivated,
        refreshCheddarBalance,
        cheddarNFTsData,
        isLoadingCheddarNFTs,
        blockchainChangedOnLoad,
        setBlockchainChangedOnLoad,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export function useGlobalContext() {
  return useContext(GlobalContext);
}
