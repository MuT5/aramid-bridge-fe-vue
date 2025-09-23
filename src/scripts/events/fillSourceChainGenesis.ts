import { useAppStore } from '@/stores/app'
import { executeWithAlgodFailover } from '../algo/getAlgodClientByChainIdWithFailover'

export const fillSourceChainGenesis = async () => {
  const store = useAppStore()
  if (!store.state.sourceChainGenesis) {
    if (store.state.sourceChainConfiguration?.type == 'algo') {
      try {
        const params = await executeWithAlgodFailover(
          store.state.sourceChainConfiguration.chainId,
          async (algod) => {
            return await algod.getTransactionParams().do()
          },
          'fillSourceChainGenesis getTransactionParams'
        )
        store.state.sourceChainGenesis = params?.genesisID
      } catch (error) {
        console.error('Failed to get source chain genesis:', error)
      }
    }
  }
}
