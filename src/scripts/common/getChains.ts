import type { ChainId2ChainItem } from '../interface/mapping/ChainId2ChainItem'
import getPublicConfiguration from './getPublicConfiguration'

const getChains = async (): Promise<ChainId2ChainItem> => {
  const publicConfiguration = await getPublicConfiguration(false)
  if (!publicConfiguration) throw Error('Missing public configuration')
  return publicConfiguration.chains
}
export default getChains
