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
        environmentId: "913a2ea1-5fe0-47b9-8188-7359de82db46",
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      {children}
    </DynamicContextProvider>
  );
};