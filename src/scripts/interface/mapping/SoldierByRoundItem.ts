import { type SoldierId2SoldierAddress } from './SoldierId2SoldierAddress'

export type SoldierByRoundItem = {
  validFrom: number
  validUntil: number
  signThreshold: number
  sendThreshold: number
  soldiers: SoldierId2SoldierAddress
}
