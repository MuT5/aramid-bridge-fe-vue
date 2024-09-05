import type { PublicConfigurationRoot } from '../interface/mapping/PublicConfigurationRoot'

const getChainConfigurationSync = (chain: number, publicConfiguration: PublicConfigurationRoot) => {
  if (!chain) return null
  console.log(`publicConfiguration ${chain}`, publicConfiguration)
  return publicConfiguration?.chains[chain]
}
export default getChainConfigurationSync
