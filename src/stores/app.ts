import { reactive } from 'vue'
import { defineStore } from 'pinia'
import type { IAppState } from '@/scripts/interface/aramid/IAppState'
import { ITxStatus } from '@/scripts/interface/aramid/ITxStatus'
export const useAppStore = defineStore('app', () => {
  const state = reactive<IAppState>({
    appConfiguration: null,
    publicConfiguration: null,
    secureConfiguration: null,

    isBridgeTabOpen: true,
    isClaimTabOpen: false,
    isReviewTabOpen: false,
    escrowBalanceIsSufficient: true,
    escrowBalanceIsSufficient10x: true,
    chainConfigs: {},
    isMintScreen: false,
    requestDestinationTokenBalanceRefresh: false,
    sourceAmount: '0',
    sourceAmountFormatted: '0',
    destinationAmount: '0',
    destinationAmountFormatted: '0',
    feeAmount: '0',
    feeAmountFormatted: '0',

    approveTxStatus: ITxStatus.isNeutral,
    BridgeTxStatus: ITxStatus.isNeutral,
    claimTxStatus: ITxStatus.isNeutral,

    escrowBalance: '0',
    dialogSelectSourceChainIsOpen: false,
    dialogSelectSourceAssetIsOpen: false,
    dialogSelectSourceWalletAVMIsOpen: false,
    dialogSelectDestinationChainIsOpen: false,
    dialogSelectDestinationAssetIsOpen: false,
    dialogSelectDestinationWalletAVMIsOpen: false,
    sourceBridgeAddress: '',
    memo: '',
    destinationBridgeAddress: ''
  })

  return { state }
})
