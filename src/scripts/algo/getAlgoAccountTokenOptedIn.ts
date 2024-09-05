import getSecureConfiguration from '../common/getSecureConfiguration'
import getIndexerClientByChainId from './getIndexerClientByChainId'
import asyncdelay from '../common/asyncDelay'

const getAlgoAccountTokenOptedIn = async (chainId: number, accountAddress: string, asa: number): Promise<boolean | null> => {
  const secureConfiguration = await getSecureConfiguration()
  if (!secureConfiguration?.chains || !secureConfiguration.chains[chainId]) return null
  const indexer = await getIndexerClientByChainId(chainId)
  await asyncdelay(200)
  if (indexer == null) return null
  const account = await indexer?.lookupAccountByID(accountAddress).do()
  if (!account || !account.account) false
  if (asa == 0) {
    return account.account.amount
  }
  if (!account.account.assets) return false
  const asaItem = account.account.assets.find((a: any) => a['asset-id'] == asa)
  if (!asaItem) return false
  const ret = asaItem['opted-in-at-round'] > 0 && !asaItem['is-frozen'] && !asaItem['deleted']
  console.log(`optin:${chainId}:${accountAddress}:${asa}:${ret}`)
  return ret
}
export default getAlgoAccountTokenOptedIn
