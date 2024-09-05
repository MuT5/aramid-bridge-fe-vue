import { type OracleValuesWithValidity } from './OracleValuesWithValidity'

export interface Chains {
  [key: number]: OracleValuesWithValidity
}

export interface OracleDestination {
  validFrom: number
  toChains: Chains
}
