import getBridgeContractAddress from './getBridgeContractAddress'
import getPublicConfiguration from './getPublicConfiguration'

const getBridgeContractAddressAsync = async (chainId: number) => {
  const publicConfiguration = await getPublicConfiguration(false)
  if (!publicConfiguration) throw Error('Public configuration is missing')
  return getBridgeContractAddress(chainId, publicConfiguration)
}
export default getBridgeContractAddressAsync
