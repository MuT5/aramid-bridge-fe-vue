import { useAppStore } from '@/stores/app'

export const resetStateSoft = () => {
  const store = useAppStore()
  store.state.bridgeTx = ''
  store.state.claimData = undefined
  store.state.claimDataTxHash = ''
  store.state.claimTx = ''
  store.state.claimTxHash = ''
  store.state.memo = ''
}
