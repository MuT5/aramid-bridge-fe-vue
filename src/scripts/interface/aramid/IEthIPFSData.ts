import { type ChainInfo } from './ChainInfo'

export type IEthIPFSData = {
  destinationChainData: ChainInfo
  destinationRound: number
  maxClaimRound: number
  note: string
  signatures: Array<string>
  sourceChainData: ChainInfo
  sourceRound: number
  sourceTransactionId: string
  soldierAccIds?: string[]
}
