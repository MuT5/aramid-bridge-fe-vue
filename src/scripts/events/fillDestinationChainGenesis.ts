import { useAppStore } from '@/stores/app'
import getAlgodClientByChainId from '../algo/getAlgodClientByChainId'

export const fillDestinationChainGenesis = async () => {
  const store = useAppStore()
  if (!store.state.destinationChainGenesis) {
    if (store.state.destinationChainConfiguration?.type == 'algo') {
      const algod = await getAlgodClientByChainId(store.state.destinationChainConfiguration.chainId)
      const params = await algod?.getTransactionParams().do()
      store.state.destinationChainGenesis = params?.genesisID
    }
  }
}
