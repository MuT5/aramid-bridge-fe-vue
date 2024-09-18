import ropsten from '@/assets/contracts/ropsten/Bridge.json'
import rinkeby from '@/assets/contracts/rinkeby/Bridge.json'
import polygon from '@/assets/contracts/polygon/Bridge.json'

const chainId2Bridge = (chainId: number) => {
  switch (`${chainId}`) {
    case '3':
      return ropsten
    case '4':
      return rinkeby
    case '80001':
      return polygon
    default:
      return rinkeby
  }
}
export default chainId2Bridge
