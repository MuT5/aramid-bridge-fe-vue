import asyncdelay from '../common/asyncDelay'
import getAppConfiguration from '../common/getAppConfiguration'
import getPublicConfiguration from '../common/getPublicConfiguration'
import getIndexerClientByChainId from './getIndexerClientByChainId'

export const getBridgeLog = async () => {
  const appConfiguration = await getAppConfiguration()
  if (!appConfiguration) {
    console.error('!appConfiguration')
    return
  }
  const publicConfiguration = await getPublicConfiguration(false)
  if (!publicConfiguration) {
    console.error('!publicConfiguration')
    return
  }
  console.log('bridgelog', appConfiguration, publicConfiguration)

  const indexer = await getIndexerClientByChainId(appConfiguration.mainNetwork)
  if (!indexer) return
  await asyncdelay(200)
  return await indexer.lookupAccountTransactions(publicConfiguration.addresses.claims).do()
}
