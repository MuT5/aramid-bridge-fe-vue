import BigNumber from 'bignumber.js'
import Web3, { type ContractAbi } from 'web3'
import getSecureConfiguration from '../common/getSecureConfiguration'
import type { EthPrivateConfiguration } from '../interface/eth/EthPrivateConfiguration'
import erc20abi from './erc20abi'

const getEthAccountTokenBalance = async (chainId: number, walletAddress: string, tokenAddress: string): Promise<BigNumber | null> => {
  const secureConfiguration = await getSecureConfiguration()

  if (!secureConfiguration || !secureConfiguration.chains || !secureConfiguration.chains[chainId]) return null
  const config = secureConfiguration.chains[chainId] as EthPrivateConfiguration
  if (!config || config.type !== 'eth') {
    console.error('wrong configuration', config)
    return null
  }

  //console.log('fetching balance on eth of', tokenAddress, 'for', walletAddress, 'on chain', chainId)

  //console.log('config.providerUrl', config.providerUrl)
  const web3 = new Web3(config.providerUrl)
  //console.log('web3', web3)
  let balance: string | null = null

  if (/^0x([0-1]{40})$/.test(tokenAddress)) {
    // native token
    try {
      //console.log('web3.eth.getBalance', walletAddress)
      const bal = await web3.eth.getBalance(walletAddress)
      balance = bal.toString()
      //console.log('web3.eth.getBalance=balance native token', walletAddress, balance)
      if (balance === undefined || balance === null) {
        throw 'undefined or null balance'
      }
    } catch (e) {
      //console.log('error fetching balance:', e)
      try {
        if ((balance === undefined || balance === null || balance === 'NaN') && config.providerUrl2) {
          //console.log('trying secondary RPC')
          const bal = await new Web3(config.providerUrl2).eth.getBalance(walletAddress)
          balance = bal.toString()
        }
      } catch (e) {
        //console.log('error fetching balance from secondary RPC:', e)
        try {
          if ((balance === undefined || balance === null || balance === 'NaN') && config.providerUrl3) {
            //console.log('trying tertiary RPC')
            const bal = await new Web3(config.providerUrl3).eth.getBalance(walletAddress)
            balance = bal.toString()
          }
        } catch (e) {
          //console.log('error fetching balance from tertiary RPC:', e)
          balance = null
        }
      }
    }
  } else {
    // The minimum ABI to get ERC20 Token balance
    //console.log('/^0x([0-1]{40})$/.test(tokenAddress)', false, tokenAddress)
    const abi: ContractAbi = JSON.parse(JSON.stringify(erc20abi))

    let contract = new web3.eth.Contract(abi, tokenAddress)
    try {
      balance = await contract.methods.balanceOf(walletAddress).call()
      if (balance === undefined || balance === null) {
        throw 'undefined or null balance'
      }
    } catch (error) {
      //console.log('error fetching balance from primary RPC:', config.providerUrl, error, balance)
      try {
        if ((balance === undefined || balance === null) && config.providerUrl2) {
          //console.log('trying secondary RPC:', config.providerUrl2)
          contract = new new Web3(config.providerUrl2).eth.Contract(abi, tokenAddress)
          balance = await contract.methods.balanceOf(walletAddress).call()
        }
      } catch (err) {
        //console.log('error fetching from secondary RPC:', err)
        try {
          if ((balance === undefined || balance === null || balance === 'NaN') && config.providerUrl3) {
            //console.log('trying tertiary RPC:', config.providerUrl3)
            contract = new new Web3(config.providerUrl3).eth.Contract(abi, tokenAddress)
            balance = await contract.methods.balanceOf(walletAddress).call()
          }
        } catch (e) {
          //console.log('error fetching balance from tertiary RPC:', e)
          balance = null
        }
        balance = null
      }
    }
  }

  //console.log('eth.balance', balance, new BigNumber(balance ?? '0'))
  return new BigNumber(balance ?? '0')
}

export default getEthAccountTokenBalance
