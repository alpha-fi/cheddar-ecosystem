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
import { getDataFromURL } from '@/utilities/exportableFunctions';
import { useToast } from '@chakra-ui/react';
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
  urlParams: URLSearchParams;
}

export type PersistedDataOnRedirectionMethodName =
  | 'buyMazeMatch'
  | 'endMazeMatch'
  | 'startMazeMatch'
  | 'loseGame';

export interface PersistedDataOnRedirection {
  blockchain: Blockchain;
  methodName: PersistedDataOnRedirectionMethodName;
  errorMsg: string;
}

const GlobalContext = React.createContext({} as GlobalContextProps);

export const GlobalContextProvider: any = ({ children }: any) => {
  const urlParams = useMemo(
    () => new URLSearchParams(window.location.search),
    []
  );

  const { transactionHash, persistedData, errorCode } =
    getDataFromURL(urlParams);

  const [blockchain, setBlockchain] = useState<Blockchain>(
    persistedData.blockchain ?? 'base'
  );

  useEffect(() => {
    if (persistedData.blockchain) setBlockchainChangedOnLoad(true);
  }, []);

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
  const { data: cheddarNearBalance, isLoading: isLoadingCheddarNearBalance } =
    useGetCheddarBalance();
  const { data: cheddarBaseBalance, isLoading: isLoadingCheddarBaseBalance } =
    useGetCheddarBaseBalance();
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

  const toast = useToast();

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

  const clearUrlParams = () => {
    const url = new URL(window.location.href);
    url.search = '';
    window.history.replaceState({}, document.title, url.toString());
  };

  useEffect(() => {
    if (urlParams) {
      if (persistedData.methodName === 'buyMazeMatch' && transactionHash) {
        toast({
          title: 'Successful purchase',
          status: 'success',
          duration: 9000,
          position: 'bottom-right',
          isClosable: true,
        });
      }
      if (persistedData.methodName && errorCode) {
        toast({
          title: `Error ${persistedData.errorMsg}`,
          status: 'error',
          duration: 9000,
          position: 'bottom-right',
          isClosable: true,
          description: `Error code: ${errorCode}`,
        });
      }

      clearUrlParams();
    }
  }, []);

  useEffect(() => {
    if (!blockchainChangedOnLoad) {
      // For some reason when you enter the site you get addresses.near but not addresses.base
      // That's the reason of why i use the setTimeout
      if (!addresses.base && addresses.near) {
        setBlockchain('near');
      } else {
        setBlockchain('base');
      }
      setTimeout(() => {
        setBlockchainChangedOnLoad(true);
      }, 500);
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
        urlParams,
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
