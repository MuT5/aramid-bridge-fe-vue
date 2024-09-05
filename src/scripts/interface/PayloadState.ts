import { type IProof } from './aramid/IProof'

export enum StateTypeEnum {
  Processed = 'processed',
  Submitting = 'submitting'
}

export type PayloadState = {
  state: StateTypeEnum
  time: Date
  proof: IProof
}
