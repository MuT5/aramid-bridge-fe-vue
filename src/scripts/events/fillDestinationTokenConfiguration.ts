import { useAppStore } from '@/stores/app'
import getToken from '../common/getToken'
import { fillRouteInfo } from './fillRouteInfo'

export const fillDestinationTokenConfiguration = (tokenId: string | undefined = undefined, paramValue: string | string[] | undefined = undefined) => {
  const store = useAppStore()
  if (!store.state.publicConfiguration) return
  if (!store.state.sourceChain) return
  if (!store.state.destinationChain) return
  if (!store.state.sourceToken) return

  if (tokenId) {
    const destToken = tokenId
    const destTokenObj = getToken(store.state.destinationChain, destToken, store.state.publicConfiguration)

    if (destToken && destTokenObj) {
      console.log('fillDestinationTokenConfiguration', destToken, destTokenObj.name)
      store.state.destinationToken = destToken
      store.state.destinationTokenConfiguration = destTokenObj
    }
  } else if (paramValue) {
    if (!store.state.destinationToken || !store.state.destinationTokenConfiguration) {
      let tokenFromPath = Object.values(store.state.publicConfiguration.chains[store.state.destinationChain.toString()].tokens).find((c) => c.name == paramValue)?.tokenId
      if (!tokenFromPath) {
        const destTokens = Object.keys(store.state.publicConfiguration.chains2tokens[store.state.sourceChain.toString()][store.state.destinationChain.toString()][store.state.sourceToken])
        destTokens.sort()
        tokenFromPath = destTokens[0]
      }
      const destTokenObj = getToken(store.state.destinationChain, tokenFromPath, store.state.publicConfiguration)

      if (tokenFromPath && destTokenObj) {
        console.log('fillDestinationTokenConfiguration', tokenFromPath, destTokenObj.name)
        store.state.destinationToken = tokenFromPath
        store.state.destinationTokenConfiguration = destTokenObj
      }
    }
  } else {
    if (!store.state.destinationToken || !store.state.destinationTokenConfiguration) {
      const destTokens = Object.keys(store.state.publicConfiguration.chains2tokens[store.state.sourceChain.toString()][store.state.destinationChain.toString()][store.state.sourceToken])
      destTokens.sort()
      const destToken = destTokens[0]
      const destTokenObj = getToken(store.state.destinationChain, destToken, store.state.publicConfiguration)

      if (destToken && destTokenObj) {
        console.log('fillDestinationTokenConfiguration', destToken, destTokenObj.name)
        store.state.destinationToken = destToken
        store.state.destinationTokenConfiguration = destTokenObj
      }
    }
  }
  fillRouteInfo()
}
