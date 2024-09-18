import { type ChainTypeEnum } from './ChainTypeEnum'
import { type SoldierByRoundItem } from './SoldierByRoundItem'
import { type TokenId2TokenItem } from './TokenId2TokenItem'

export type ChainItem = {
  chainId: number
  name: string
  type: ChainTypeEnum
  logo: string
  folder: string
  address: string
  tokens: TokenId2TokenItem
  blockExplorers: Array<string>
  soldiersByRound: Array<SoldierByRoundItem>
  confirmationCount: number
}
