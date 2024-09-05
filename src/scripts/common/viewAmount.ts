import formatBaseAmount from './formatBaseAmount'

export const viewAmount = (value: string, decimals: number) => {
  if (!value || !decimals) {
    return '0.0'
  }
  const amount = formatBaseAmount(value, decimals)
  return amount === 'NaN' ? '0.0' : amount
}
