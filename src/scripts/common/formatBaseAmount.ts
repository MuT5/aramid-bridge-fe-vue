const formatBaseAmount = (amount: string, decimals: number): string => {
  let showDecimals = decimals
  if (showDecimals > 8) showDecimals = 8
  const formatter = new Intl.NumberFormat(undefined, {
    minimumFractionDigits: showDecimals,
    maximumFractionDigits: showDecimals
  })

  const ret = formatter.format(parseInt(amount) / 10 ** decimals)
  if (ret.length > 12) {
    return ret.substring(0, 12) + '…'
  } else {
    return ret
  }
}
export default formatBaseAmount
