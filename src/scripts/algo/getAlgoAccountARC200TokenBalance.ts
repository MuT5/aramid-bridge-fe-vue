import BigNumber from 'bignumber.js'
import getSecureConfiguration from '../common/getSecureConfiguration'
import getIndexerClientByChainId from './getIndexerClientByChainId'
import asyncdelay from '../common/asyncDelay'
import algosdk from 'algosdk'
import getAlgodClientByChainId from './getAlgodClientByChainId'
import { arc200 } from 'ulujs'

const getAlgoAccountTokenBalance = async (chainId: number, accountAddress: string, contractId: number, assetId: number): Promise<BigNumber | null> => {
  try {
    if (!algosdk.isValidAddress(accountAddress)) return new BigNumber('0')
    const secureConfiguration = await getSecureConfiguration()
    if (!secureConfiguration?.chains || !secureConfiguration.chains[chainId]) return null
    const indexerClient = await getIndexerClientByChainId(chainId)
    const algodClient = await getAlgodClientByChainId(chainId)
    await asyncdelay(200)

    // balance, how much ARC200 is in the account
    const ci = new arc200(contractId, algodClient, indexerClient)
    const balanceR = await ci.arc200_balanceOf(accountAddress)
    const balance = balanceR.success ? balanceR.returnValue : BigInt(0)
    const account = await indexerClient?.lookupAccountByID(accountAddress).do()
    if (!account || !account.account) return new BigNumber('0')

    // assetItem, how much ARC200-ASA is in the account with default 0
    //if (!account.account.assets) return new BigNumber('0') // removed because of ARC200
    const asaItem = account.account?.assets?.find((a: any) => a['asset-id'] == assetId) || {
      ['asset-id']: assetId,
      amount: 0
    }
    const asaAmount = asaItem ? BigInt(asaItem.amount) : BigInt(0)

    if (!asaItem && balance == BigInt(0)) return new BigNumber('0') // if no ARC200-ASA and no ARC200, return 0

    console.log('algo.account', chainId, accountAddress, contractId, assetId, balance, asaAmount)
    const ret = new BigNumber((asaAmount + balance).toString()) // combine ARC200 and ARC200-ASA
    console.log('account.amount', ret.toFixed(0, 1))
    return ret
  } catch (e) {
    console.error(e)
    return new BigNumber('0')
  }
}
export default getAlgoAccountTokenBalance
