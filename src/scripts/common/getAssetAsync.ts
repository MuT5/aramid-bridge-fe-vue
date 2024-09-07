import getPublicConfiguration from './getPublicConfiguration'

const getAssetAsync = async (chain: number, token: string) => {
  const publicConfiguration = await getPublicConfiguration(false)
  if (!publicConfiguration) throw Error('Public configuration is missing')
  return publicConfiguration.chains[chain].tokens[token]
}
export default getAssetAsync
