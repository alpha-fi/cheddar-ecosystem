export interface Config {
  networkData: {
    networkId: string;
    nodeUrl: string;
    walletUrl: string;
    helperUrl: string;
    explorerUrl: string;
    buyCheddarInRefUrl: string;
    nadaBotUrl: string;
    nftImageBaseUrl: string;
    indexerUrl: string;
  };
  contracts: {
    near: {
      cheddarNft: string;
      cheddarToken: string;
      nearSocial: string;
      checkers: string;
      nekoToken: string;
    };
    base: {
      cheddarToken: string;
    };
  };
  socialKeys: {
    ecosystem: string;
    mazeVersion: string;
  };
  backendBaseUrl: string;
}

export const getConfig = (): Config => {
  const network = process.env.NEXT_PUBLIC_NETWORK;
  switch (network) {
    case 'mainnet':
      return {
        networkData: {
          networkId: 'mainnet',
          nodeUrl: 'https://free.rpc.fastnear.com/',
          walletUrl: 'https://wallet.near.org',
          helperUrl: 'https://helper.mainnet.near.org',
          explorerUrl: 'https://explorer.mainnet.near.org',
          indexerUrl: 'https://api.kitwallet.app',
          buyCheddarInRefUrl:
            'https://app.ref.finance/#near|token.cheddar.near',
          nadaBotUrl: 'https://app.nada.bot/',
          nftImageBaseUrl:
            'https://bafybeibghcllcmurku7lxyg4wgxn2zsu5qqk7h4r6bmyhpztmyd564cx54.ipfs.dweb.link/',
        },
        contracts: {
          near: {
            cheddarNft: 'nft.cheddar.near',
            cheddarToken: 'token.cheddar.near',
            nearSocial: 'social.near',
            checkers: 'checkers.cheddar.near',
            nekoToken: 'ftv2.nekotoken.near',
          },
          base: {
            cheddarToken: '0x0000000000000000000000000000000000000000',
          },
        },
        socialKeys: {
          ecosystem: 'cheddarEcosystem',
          mazeVersion: 'maze_v0.0.1',
        },
        backendBaseUrl: 'https://api.cheddar.farm:3002/',
      };
    case 'testnet':
      return {
        networkData: {
          networkId: 'testnet',
          nodeUrl: 'https://rpc.testnet.pagoda.co',
          walletUrl: 'https://wallet.testnet.near.org',
          indexerUrl: 'https://testnet-api.kitwallet.app',
          helperUrl: 'https://helper.testnet.near.org',
          explorerUrl: 'https://explorer.testnet.near.org',
          buyCheddarInRefUrl:
            'https://testnet.ref.finance/#near|token.cheddar.testnet',
          nadaBotUrl: 'https://testnet.nada.bot/',
          nftImageBaseUrl:
            'https://bafybeibghcllcmurku7lxyg4wgxn2zsu5qqk7h4r6bmyhpztmyd564cx54.ipfs.dweb.link/',
        },
        contracts: {
          near: {
            cheddarNft: 'nft.cheddar.testnet',
            cheddarToken: 'token-v3.cheddar.testnet',
            nearSocial: 'v1.social08.testnet',
            checkers: 'checkers.cheddar.testnet',
            nekoToken: '',
          },
          base: {
            cheddarToken: '0x221659fcCb17E731b79e0fAb7b3128453360E6E4',
          },
        },
        socialKeys: {
          ecosystem: 'test_cheddarEcosystem',
          mazeVersion: 'maze_v0.0.1',
        },
        backendBaseUrl: 'https://api.cheddar.farm:3001/',
      };
    case 'local':
      return {
        networkData: {
          networkId: 'testnet',
          nodeUrl: 'https://rpc.testnet.pagoda.co',
          walletUrl: 'https://wallet.testnet.near.org',
          indexerUrl: 'https://testnet-api.kitwallet.app',
          helperUrl: 'https://helper.testnet.near.org',
          explorerUrl: 'https://explorer.testnet.near.org',
          buyCheddarInRefUrl:
            'https://testnet.ref.finance/#near|token.cheddar.testnet',
          nadaBotUrl: 'https://testnet.nada.bot/',
          nftImageBaseUrl:
            'https://bafybeibghcllcmurku7lxyg4wgxn2zsu5qqk7h4r6bmyhpztmyd564cx54.ipfs.dweb.link/',
        },
        contracts: {
          near: {
            cheddarNft: 'nft.cheddar.testnet',
            cheddarToken: 'token-v3.cheddar.testnet',
            nearSocial: 'v1.social08.testnet',
            checkers: 'checkers.cheddar.testnet',
            nekoToken: '',
          },
          base: {
            cheddarToken: '0x221659fcCb17E731b79e0fAb7b3128453360E6E4',
          },
        },
        socialKeys: {
          ecosystem: 'test_cheddarEcosystem',
          mazeVersion: 'maze_v0.0.1',
        },
        backendBaseUrl: 'http://localhost:3001/',
      };
    default:
      throw Error(
        `Unconfigured environment '${network}'. Can be configured in src/config.js.`
      );
  }
};
