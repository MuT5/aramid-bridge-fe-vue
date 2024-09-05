import { type EntrySequence } from './EntrySequence'
import { type PayloadEthSignatures } from './PayloadEthSignatures'

export type Payload = {
  sourceRound: number
  destinationRound: number
  feeToken: string
  sourceChainId: number
  sourceToken: string
  sourceTransactionId: string
  sourceAmount: string
  sourceAddress: string
  destinationChainId: number
  destinationAddress: string
  destinationAmount: string
  destinationToken: string
  signedMessage: string
  note: string
  signatures: PayloadEthSignatures
  entrySequence: EntrySequence
  time: Date
}
