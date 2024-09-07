import getPublicConfiguration from '../common/getPublicConfiguration'

let cache: Array<number> | null = null
const getEthChains = async () => {
  if (cache !== null) return cache
  const publicConfiguration = await getPublicConfiguration(false)
  if (!publicConfiguration) throw Error('Public configuration is missing')

  const ret = []
  for (const chain of Object.keys(publicConfiguration.chains)) {
    if (publicConfiguration.chains[chain].type == 'algo') {
      ret.push(parseInt(chain))
    }
  }
  cache = ret
  return cache
}
export default getEthChains
