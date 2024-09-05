export type IClaim = {
  sourceTransactionId: string
  sourceChainId: number
  destinationChainId: number
  ipfsHash?: string
  aramidChainTx: string
}
