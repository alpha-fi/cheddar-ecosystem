import { base, baseSepolia } from 'wagmi/chains';

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
      nadaBot: string;
    };
    base: {
      cheddarToken: string;
      cheddarMinter: string;
    };
  };
  chains: {
    base: any;
  };
  socialKeys: {
    ecosystem: string;
    mazeVersion: string;
  };
  backendBaseUrl: string;
  holonym: {
    phoneIssuance: string;
    phoneSBT: string;
    govIdIssuance: string;
    govIdSBT: string;
  };
}

export const getConfig = (): Config => {
  const network = process.env.NEXT_PUBLIC_NETWORK;
  const holonym = {
    phoneIssuance: 'https://silksecure.net/holonym/diff-wallet/phone',
    phoneSBT:
      'https://api.holonym.io/sybil-resistance/phone/near?action-id=123456789',
    govIdIssuance: 'https://silksecure.net/holonym/diff-wallet/gov-id',
    govIdSBT:
      'https://api.holonym.io/sybil-resistance/gov-id/near?action-id=123456789',
  };
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
            'https://bafybeicoln5rvccttgypzo26irjlskslnfynkzig6bowpsj6ay45geeice.ipfs.nftstorage.link/',
        },
        contracts: {
          near: {
            cheddarNft: 'nft.cheddar.near',
            cheddarToken: 'token.cheddar.near',
            nearSocial: 'social.near',
            checkers: 'checkers.cheddar.near',
            nekoToken: 'ftv2.nekotoken.near',
            nadaBot: 'v1.nadabot.near',
          },
          base: {
            cheddarToken: '0xE757c0263C1828a7380D66bef7Fd10b5d189Ee35',
            cheddarMinter: '0xF693f6450fb51033D744Cc6b78371b7d0d9797E7',
          },
        },
        chains: {
          base: base,
        },
        socialKeys: {
          ecosystem: 'cheddarEcosystem',
          mazeVersion: 'maze_v0.0.1',
        },
        backendBaseUrl: 'https://api.cheddar.farm:3000/',
        holonym: holonym,
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
            'https://bafybeicoln5rvccttgypzo26irjlskslnfynkzig6bowpsj6ay45geeice.ipfs.nftstorage.link/',
        },
        contracts: {
          near: {
            cheddarNft: 'nft.cheddar.testnet',
            cheddarToken: 'token-v3.cheddar.testnet',
            nearSocial: 'v1.social08.testnet',
            checkers: 'checkers.cheddar.testnet',
            nekoToken: '',
            nadaBot: 'v1.nadabot.testnet',
          },
          base: {
            cheddarToken: '0xE757c0263C1828a7380D66bef7Fd10b5d189Ee35',
            cheddarMinter: '0xF693f6450fb51033D744Cc6b78371b7d0d9797E7',
          },
        },
        chains: {
          base: baseSepolia,
        },
        socialKeys: {
          ecosystem: 'test_cheddarEcosystem',
          mazeVersion: 'maze_v0.0.1',
        },
        backendBaseUrl: 'https://api.cheddar.farm:3001/',
        holonym: holonym,
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
            'https://bafybeicoln5rvccttgypzo26irjlskslnfynkzig6bowpsj6ay45geeice.ipfs.nftstorage.link/',
        },
        contracts: {
          near: {
            cheddarNft: 'nft.cheddar.testnet',
            cheddarToken: 'token-v3.cheddar.testnet',
            nearSocial: 'v1.social08.testnet',
            checkers: 'checkers.cheddar.testnet',
            nekoToken: '',
            nadaBot: 'v1.nadabot.testnet',
          },
          base: {
            cheddarToken: '0xd6DDB2F86cEc8fD31e7488e7F1874060b376eAfD',
            cheddarMinter: '0x4D2e7A7dA2abB9d3A12538C645f5D7aB080EAa90',
          },
        },
        chains: {
          base: baseSepolia,
        },
        socialKeys: {
          ecosystem: 'test_cheddarEcosystem',
          mazeVersion: 'maze_v0.0.1',
        },
        backendBaseUrl: 'http://localhost:3001/',
        holonym: holonym,
      };
    default:
      throw Error(
        `Unconfigured environment '${network}'. Can be configured in src/config.js.`
      );
  }
};
