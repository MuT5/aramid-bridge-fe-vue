import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal from 'web3modal';

// IMPORTANT!!!!!!
// make sure only 1 instance of web3Modal is ever created,
// otherwise it will result in a bug where the modal does not disappear after connecting to wallet

let web3Modal: Web3Modal = null;

const providerOptions = {
  // options for web3modal
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      rpc: {
        80001: 'https://matic-mumbai.chainstacklabs.com', // mumbai
        11155111: 'https://rpc.sepolia.org', // sepolia
        137: 'https://polygon-rpc.com', // polygon mainnet
        1: 'https://mainnet.infura.io/v3', // ethereum mainnet
        1313161554: 'https://aurora-mainnet.infura.io/v3', // aurora mainnet
        1313161555: 'https://aurora-testnet.infura.io/v3', // aurora testnets
      },
      infuraId: '57f8955a47424a1a85d6aad4951396e5', // required
    },
  },
};

const getWeb3Modal = (window: any) => {
  if (web3Modal !== null) return web3Modal;
  if (!window) return null;
  web3Modal = new Web3Modal({
    network: 'mainnet',
    providerOptions,
  });
};

export default getWeb3Modal;
