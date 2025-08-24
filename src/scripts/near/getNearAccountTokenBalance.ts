import BigNumber from 'bignumber.js'

export const getNearAccountTokenBalance = async (nearWallet: any, token: string, account: string) => {
  try {
    const balance = await nearWallet.viewMethod({ method: 'ft_balance_of', args: { account_id: account }, contractId: token })
    return new BigNumber(balance)
  } catch (e) {
    console.log('file: getNearAccountTokenBalance.ts:11  getNearAccountTokenBalance  e:', e, nearWallet.accountId, token)
    return new BigNumber(0)
  }
}
