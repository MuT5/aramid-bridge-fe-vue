import { type AlgoPrivateConfiguration } from '../algo/AlgoPrivateConfiguration'
import { type EthPrivateConfiguration } from '../eth/EthPrivateConfiguration'

export interface NetworksPrivateConfiguration {
  [key: string]: AlgoPrivateConfiguration | EthPrivateConfiguration
}
