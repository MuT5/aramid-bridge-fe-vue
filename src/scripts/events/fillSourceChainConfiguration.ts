import { useAppStore } from '@/stores/app'
import getChainConfigurationSync from '../common/getChainConfigurationSync'
import { fillRouteInfo } from './fillRouteInfo'

export const fillSourceChainConfiguration = (chainId: number | undefined = undefined, paramValue: string | string[] | undefined = undefined) => {
  const store = useAppStore()
  if (!store.state.publicConfiguration) return
  if (chainId) {
    const chain = chainId
    const chainObj = getChainConfigurationSync(chain, store.state.publicConfiguration)
    if (chain && chainObj) {
      console.log('fillSourceChainConfiguration', chain, chainObj.name)
      store.state.sourceChain = chain
      store.state.sourceChainConfiguration = chainObj
    }
  } else if (!store.state.destinationChain && paramValue) {
    console.log("route.params['sourceChain']", paramValue)
    let chainFromPath = Object.values(store.state.publicConfiguration.chains).find((c) => c.name == paramValue)?.chainId
    if (!chainFromPath) {
      const keys = Object.keys(store.state.publicConfiguration.chains2tokens)
      keys.sort()
      chainFromPath = Number(keys[0])
    }

    const chain = Number(chainFromPath)
    const chainObj = getChainConfigurationSync(chain, store.state.publicConfiguration)
    if (chain && chainObj) {
      console.log('fillSourceChainConfiguration', chain, chainObj.name)
      store.state.sourceChain = chain
      store.state.sourceChainConfiguration = chainObj
    }
  } else if (!store.state.destinationChain) {
    const keys = Object.keys(store.state.publicConfiguration.chains2tokens)
    keys.sort()
    const chain = Number(keys[0])
    const chainObj = getChainConfigurationSync(chain, store.state.publicConfiguration)
    if (chain && chainObj) {
      console.log('fillSourceChainConfiguration', chain, chainObj.name)
      store.state.sourceChain = chain
      store.state.sourceChainConfiguration = chainObj
    }
  } else {
    // we have already destination chain defined, so we should match to it
    const keys = Object.keys(store.state.publicConfiguration.chains2tokens[store.state.destinationChain.toString()])
    keys.sort()
    const chain = Number(keys[0])
    const chainObj = getChainConfigurationSync(chain, store.state.publicConfiguration)
    if (chain && chainObj) {
      console.log('fillSourceChainConfiguration', chain, chainObj.name)
      store.state.sourceChain = chain
      store.state.sourceChainConfiguration = chainObj
    }
  }
  fillRouteInfo()
}
