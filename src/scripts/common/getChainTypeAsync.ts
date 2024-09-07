import getChainType from './getChainType'
import getPublicConfiguration from './getPublicConfiguration'
/**
 * returns eth|algo
 *
 * @param chain
 * @returns eth|algo
 */
const getChainTypeAsync = async (chain: number): Promise<string | null> => {
  const publicConfiguration = await getPublicConfiguration(false)
  if (!publicConfiguration) throw Error('Public configuration is missing')
  return getChainType(chain, publicConfiguration)
}
export default getChainTypeAsync
