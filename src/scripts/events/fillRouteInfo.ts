import { useAppStore } from '@/stores/app'
import getBridgeContractAddress from '../common/getBridgeContractAddress'

export const fillRouteInfo = () => {
  console.log('fillRouteInfo')
  const store = useAppStore()
  if (!store.state.publicConfiguration) {
    console.log('!store.state.publicConfiguration')
    return
  }
  if (!store.state.publicConfiguration.chains2tokens) {
    console.log('!store.state.publicConfiguration.chains2tokens')
    return
  }
  if (!store.state.sourceChain) {
    console.log('!store.state.sourceChain')
    return
  }
  if (!store.state.destinationChain) {
    console.log('!store.state.destinationChain')
    return
  }
  if (!store.state.sourceToken) {
    console.log('!store.state.sourceToken')
    return
  }
  if (!store.state.destinationToken) {
    console.log('!store.state.destinationToken')
    return
  }
  if (!store.state.publicConfiguration.chains2tokens[store.state.sourceChain.toString()]) {
    console.log('!store.state.publicConfiguration.chains2tokens[store.state.sourceChain.toString()]')
    return
  }
  if (!store.state.publicConfiguration.chains2tokens[store.state.sourceChain.toString()][store.state.destinationChain.toString()]) {
    console.log('!store.state.publicConfiguration.chains2tokens[store.state.sourceChain.toString()][store.state.destinationChain.toString()]')
    return
  }
  if (!store.state.publicConfiguration.chains2tokens[store.state.sourceChain.toString()][store.state.destinationChain.toString()][store.state.sourceToken]) {
    console.log('!store.state.publicConfiguration.chains2tokens[store.state.sourceChain.toString()][store.state.destinationChain.toString()][store.state.sourceToken]')
    return
  }
  if (!store.state.publicConfiguration.chains2tokens[store.state.sourceChain.toString()][store.state.destinationChain.toString()][store.state.sourceToken][store.state.destinationToken]) {
    console.log('!store.state.publicConfiguration.chains2tokens[store.state.sourceChain.toString()][store.state.destinationChain.toString()][store.state.sourceToken][store.state.destinationToken]')
    return
  }
  store.state.routeConfig =
    store.state.publicConfiguration.chains2tokens[store.state.sourceChain.toString()][store.state.destinationChain.toString()][store.state.sourceToken][store.state.destinationToken]

  const sourceBridge = getBridgeContractAddress(store.state.sourceChain, store.state.publicConfiguration)
  if (sourceBridge) {
    store.state.sourceBridgeAddress = sourceBridge
  }
  const destBridge = getBridgeContractAddress(store.state.destinationChain, store.state.publicConfiguration)
  if (destBridge) {
    store.state.destinationBridgeAddress = destBridge
  }
}
