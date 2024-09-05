export enum ITxStatus {
  isNeutral = 'isNeutral',
  inProgress = 'inProgress', // when tx starts
  txExecuted = 'txExecuted', // when tx hash returns from performed tx
  txChecking = 'txChecking', // when tx is confirming by block number
  txCompleted = 'txCompleted', // when tx successfully added in blockchain after checking
  txFailed = 'txFailed', // In case tx failed,
  txAutoComplete = 'txAutoComplete' // In case of auto claim
}
