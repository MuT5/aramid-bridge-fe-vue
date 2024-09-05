import { type AddressesPublicConfiguration } from './AddressesPublicConfiguration'
import { type ChainId2ChainItem } from './ChainId2ChainItem'
import { type SourceChain2DestinationChain } from './SourceChain2DestinationChain'

export interface PublicConfigurationRoot {
  hash?: string
  addresses: AddressesPublicConfiguration
  chains: ChainId2ChainItem
  chains2tokens: SourceChain2DestinationChain
}
