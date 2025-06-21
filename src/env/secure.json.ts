import type { SecureConfiguration } from '@/scripts/interface/configuration/SecureConfiguration'

const config: SecureConfiguration = {
  chains: {
    '101001': {
      type: 'algo',
      algod: {
        host: 'https://testnet-api.algonode.cloud',
        port: 443,
        header: 'X-Algo-API-Token',
        token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        delay: 1000
      },
      indexer: {
        host: 'https://testnet-idx.algonode.cloud',
        port: 443,
        header: 'X-Indexer-API-Token',
        token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        delay: 1000
      }
    },
    '416101': {
      type: 'algo',
      algod: {
        host: 'https://mainnet-api.voi.nodely.dev',
        port: 443,
        header: 'X-Algo-API-Token',
        token: '',
        delay: 1000
      },
      indexer: {
        host: 'https://mainnet-idx.voi.nodely.dev',
        port: 443,
        header: 'X-Indexer-API-Token',
        token: '',
        delay: 1000
      }
    },
    '101003': {
      type: 'algo',
      algod: {
        host: 'https://algod.aramidmain.a-wallet.net',
        port: 443,
        header: 'X-Algo-API-Token',
        token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        delay: 1000
      },
      indexer: {
        host: 'https://aramidindexer.de-k1.a-wallet.net',
        port: 443,
        header: 'X-Indexer-API-Token',
        token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        delay: 1000
      }
    },
    '11155111': {
      type: 'eth',
      providerUrl: 'https://rpc2.sepolia.org',
      providerUrl2: '',
      providerUrl3: ''
    },
    '8453': {
      type: 'eth',
      providerUrl: 'https://base-rpc.publicnode.com',
      providerUrl2: '',
      providerUrl3: ''
    },
    '42161': {
      type: 'eth',
      providerUrl: 'https://arb1.arbitrum.io/rpc',
      providerUrl2: 'https://1rpc.io/arb',
      providerUrl3: ''
    },
    '17000': {
      type: 'eth',
      providerUrl: 'https://ethereum-holesky-rpc.publicnode.com',
      providerUrl2: '',
      providerUrl3: ''
    },
    '1313161555': {
      type: 'eth',
      providerUrl: 'https://testnet.aurora.dev/',
      providerUrl2: '',
      providerUrl3: ''
    },
    '80001': {
      type: 'eth',
      providerUrl: 'wss://polygon-mumbai.g.alchemy.com/v2/{token}',
      providerUrl2: '',
      providerUrl3: ''
    },
    '102001': {
      type: 'near',
      providerUrl: 'https://rpc.testnet.near.org',
      providerUrl2: '',
      providerUrl3: ''
    },
    '102002': {
      type: 'near',
      providerUrl: 'https://rpc.mainnet.near.org',
      providerUrl2: '',
      providerUrl3: ''
    },
    '416001': {
      type: 'algo',
      algod: {
        host: 'https://mainnet-api.algonode.cloud',
        port: 443,
        header: '',
        token: '',
        delay: 1000
      },
      indexer: {
        host: 'https://mainnet-idx.algonode.cloud',
        port: 443,
        header: '',
        token: '',
        delay: 1000
      }
    },
    '416102': {
      type: 'algo',
      algod: {
        host: 'https://testnet-api.voi.nodely.dev',
        port: 443,
        header: '',
        token: '',
        delay: 1000
      },
      indexer: {
        host: 'https://testnet-idx.voi.nodely.dev',
        port: 443,
        header: '',
        token: '',
        delay: 1000
      }
    },
    '101002': {
      type: 'algo',
      algod: {
        host: 'https://mainnet-api.algonode.cloud',
        port: 443,
        header: '',
        token: '',
        delay: 1000
      },
      indexer: {
        host: 'https://mainnet-idx.algonode.cloud',
        port: 443,
        header: '',
        token: '',
        delay: 1000
      }
    },
    '1': {
      type: 'eth',
      providerUrl: 'https://mainnet.infura.io/v3/{token}',
      providerUrl2: 'https://api.mycryptoapi.com/eth',
      providerUrl3: 'https://mainnet.infura.io/v3/{token}'
    },
    '4': {
      type: 'eth',
      providerUrl: 'https://rinkeby-light.eth.linkpool.io',
      providerUrl2: 'https://eth-rinkeby.alchemyapi.io/v2/{token}-m6wJl4F',
      providerUrl3: 'https://rinkeby.infura.io/v3/{token}'
    },
    '137': {
      type: 'eth',
      providerUrl: 'https://rpc.ankr.com/polygon/{token}',
      providerUrl2: 'https://rpc.ankr.com/polygon',
      providerUrl3: 'https://polygon-mainnet.public.blastapi.io'
    },
    '1313161554': {
      type: 'eth',
      providerUrl: 'https://aurora-mainnet.infura.io/v3/{token}',
      providerUrl2: 'https://mainnet.aurora.dev',
      providerUrl3: 'https://aurora-mainnet.infura.io/v3/{token}'
    }
  }
}
export default config
