const shortenAddress = (address: string, length: number) => {
  const addrStr = address?.toString()
  if (!addrStr || !address || address.length < length * 2) return address
  return addrStr.substring(0, length) + '...' + addrStr.substring(addrStr.length - length)
}
export default shortenAddress
