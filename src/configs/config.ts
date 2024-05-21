export interface Config {
  networkData: {
    networkId: string;
    nodeUrl: string;
    walletUrl: string;
    helperUrl: string;
    explorerUrl: string;
  };
  contracts: {
    cheddarNft: string;
    cheddarToken: string;
    nearSocial: string;
  };
}

export const getConfig = (): Config => {
  const network = process.env.NEXT_PUBLIC_NETWORK;
  switch (network) {
    case 'mainnet':
      return {
        networkData: {
          networkId: 'mainnet',
          nodeUrl: 'https://rpc.mainnet.near.org',
          walletUrl: 'https://wallet.near.org',
          helperUrl: 'https://helper.mainnet.near.org',
          explorerUrl: 'https://explorer.mainnet.near.org',
        },
        contracts: {
          cheddarNft: 'nft.cheddar.near',
          cheddarToken: '',
          nearSocial: 'social.near',
        },
      };
    case 'testnet':
    case undefined:
      return {
        networkData: {
          networkId: 'testnet',
          nodeUrl: 'https://rpc.testnet.near.org',
          walletUrl: 'https://wallet.testnet.near.org',
          helperUrl: 'https://helper.testnet.near.org',
          explorerUrl: 'https://explorer.testnet.near.org',
        },
        contracts: {
          cheddarNft: 'nft.cheddar.testnet',
          cheddarToken: 'token-v3.cheddar.testnet',
          nearSocial: 'v1.social08.testnet',
        },
      };
    case 'local':
      return {
        networkData: {
          networkId: 'local',
          nodeUrl: 'http://localhost:3030',
          walletUrl: 'http://localhost:4000/wallet',
          helperUrl: 'https://helper.testnet.near.org',
          explorerUrl: 'https://explorer.testnet.near.org',
        },
        contracts: {
          cheddarNft: '',
          cheddarToken: '',
          nearSocial: '',
        },
      };
    default:
      throw Error(
        `Unconfigured environment '${network}'. Can be configured in src/config.js.`
      );
  }
};
