import { useAppStore } from '@/stores/app'
import getChainConfigurationSync from '../common/getChainConfigurationSync'
import { fillRouteInfo } from './fillRouteInfo'

export const fillDestinationChainConfiguration = (chainId: number | undefined = undefined, paramValue: string | string[] | undefined = undefined) => {
  const store = useAppStore()
  if (!store.state.publicConfiguration) return
  if (!store.state.sourceChain) return
  if (chainId) {
    const newDestChainId = chainId
    const newDestChainObj = getChainConfigurationSync(newDestChainId, store.state.publicConfiguration)
    if (newDestChainId && newDestChainObj) {
      console.log('fillDestinationChainConfiguration', newDestChainId, newDestChainObj.name)
      store.state.destinationChain = newDestChainId
      store.state.destinationChainConfiguration = newDestChainObj
    }
  } else if (paramValue) {
    let chainFromPath = Object.values(store.state.publicConfiguration.chains).find((c) => c.name == paramValue)?.chainId
    if (!chainFromPath) {
      const keys = Object.keys(store.state.publicConfiguration.chains2tokens[store.state.sourceChain])
      keys.sort()
      chainFromPath = Number(keys[0])
    }
    const newDestChainId = chainFromPath
    const newDestChainObj = getChainConfigurationSync(newDestChainId, store.state.publicConfiguration)
    if (newDestChainId && newDestChainObj) {
      console.log('fillDestinationChainConfiguration', newDestChainId, newDestChainObj.name)
      store.state.destinationChain = newDestChainId
      store.state.destinationChainConfiguration = newDestChainObj
    }
  } else {
    const keys = Object.keys(store.state.publicConfiguration.chains2tokens[store.state.sourceChain])
    keys.sort()
    const newDestChainId = chainId ? chainId : Number(keys[0])
    const newDestChainObj = getChainConfigurationSync(newDestChainId, store.state.publicConfiguration)
    if (newDestChainId && newDestChainObj) {
      console.log('fillDestinationChainConfiguration', newDestChainId, newDestChainObj.name)
      store.state.destinationChain = newDestChainId
      store.state.destinationChainConfiguration = newDestChainObj
    }
  }

  fillRouteInfo()
}
