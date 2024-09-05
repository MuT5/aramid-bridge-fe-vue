import { type IValidityByChain } from './IValidityByChain'

export interface IAramidRoundOracle {
  ipfsFile: string
  validFrom: IValidityByChain
}
