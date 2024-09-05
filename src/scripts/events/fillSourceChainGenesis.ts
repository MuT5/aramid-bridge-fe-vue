import { useAppStore } from '@/stores/app'
import getAlgodClientByChainId from '../algo/getAlgodClientByChainId'

export const fillSourceChainGenesis = async () => {
  const store = useAppStore()
  if (!store.state.sourceChainGenesis) {
    if (store.state.sourceChainConfiguration?.type == 'algo') {
      const algod = await getAlgodClientByChainId(store.state.sourceChainConfiguration.chainId)
      const params = await algod?.getTransactionParams().do()
      store.state.sourceChainGenesis = params?.genesisID
    }
  }
}
