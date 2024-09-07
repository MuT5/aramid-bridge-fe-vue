import type { TokenItem } from '../interface/mapping/TokenItem'
import getPublicConfiguration from './getPublicConfiguration'

const getTokenAsync = async (chain: number, token: string): Promise<TokenItem> => {
  const publicConfiguration = await getPublicConfiguration(false)
  if (!publicConfiguration) throw Error('Missing public configuration')
  return publicConfiguration.chains[chain].tokens[token]
}
export default getTokenAsync
