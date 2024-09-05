import { useAppStore } from '@/stores/app'
import { fillRouteInfo } from './fillRouteInfo'

export const resetSourceChainIfNotMatched = () => {
  const store = useAppStore()
  if (!store.state.publicConfiguration) return
  if (!store.state.sourceChain) return
  if (!store.state.destinationChain) return

  if (!store.state.publicConfiguration.chains2tokens[store.state.sourceChain.toString()]) return

  if (!store.state.publicConfiguration.chains2tokens[store.state.sourceChain.toString()][store.state.destinationChain.toString()]) {
    console.log('resetSourceChainIfNotMatched')
    store.state.sourceChain = undefined
    store.state.sourceChainConfiguration = undefined
  }
  fillRouteInfo()
}
