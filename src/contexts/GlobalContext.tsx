import React, { useContext, useMemo, useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useWalletSelector } from './WalletSelectorContext';
import { coinbaseWallet } from 'wagmi/connectors';
import {
  useGetCheddarBalance,
  useGetCheddarBaseBalance,
  useGetCheddarBaseTotalSupply,
  useGetCheddarNearTotalSupply,
  useIsHolonymVerfified,
  useIsNadabotVerfified,
} from '@/hooks/cheddar';

export type Blockchain = 'base' | 'near';

interface GlobalContextProps {
  setBlockchain: React.Dispatch<React.SetStateAction<Blockchain>>;
  blockchain: Blockchain;
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
}

const GlobalContext = React.createContext({} as GlobalContextProps);

export const GlobalContextProvider: any = ({ children }: any) => {
  const [blockchain, setBlockchain] = useState<Blockchain>('base');
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

  return (
    <GlobalContext.Provider
      value={{
        setBlockchain,
        blockchain,
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
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export function useGlobalContext() {
  return useContext(GlobalContext);
}
