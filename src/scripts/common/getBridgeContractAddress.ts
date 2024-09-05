import type { PublicConfigurationRoot } from '../interface/mapping/PublicConfigurationRoot'

const getBridgeContractAddress = (chainId: number, publicConfiguration: PublicConfigurationRoot): string | null => {
  if (!publicConfiguration) return null
  if (!publicConfiguration.chains) return null
  if (!publicConfiguration.chains[chainId]) return null

  return publicConfiguration.chains[chainId].address
}
export default getBridgeContractAddress
