import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";

import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";


export default function DynamicWalletProvider({
  children
}: { children: React.ReactNode }) {
  return (
    <DynamicContextProvider
      settings={{
        // Find your environment id at https://app.dynamic.xyz/dashboard/developer
        environmentId: "91ac8500-7175-4b1a-a2d4-9fec89a202e0",
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      {children}
    </DynamicContextProvider>
  );
};