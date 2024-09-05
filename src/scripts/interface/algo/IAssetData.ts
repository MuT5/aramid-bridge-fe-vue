export interface IAssetData {
  id: number
  amount: bigint
  frozen: boolean
  decimals: number
  name?: string
  unitName?: string
  url?: string
}
