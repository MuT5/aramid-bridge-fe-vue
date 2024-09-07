import getPublicConfiguration from './getPublicConfiguration'

const getBridgableTokens = async () => {
  const publicConfiguration = await getPublicConfiguration(false)
  if (!publicConfiguration) throw Error('Public configuration is missing')
  return publicConfiguration.chains2tokens
}
export default getBridgableTokens
