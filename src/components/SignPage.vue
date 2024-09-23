<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import CopyIcon from './ui/CopyIcon.vue'
import MainBox from './ui/MainBox.vue'
import WalletAddress from './ui/WalletAddress.vue'
import { onMounted, ref, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StatusBar from './status/StatusBar.vue'
import QRCodeVue3 from 'qrcode-vue3'
import { makeNoteField } from '@/scripts/aramid/makeNoteField'
import loader from '@/assets/images/loading-buffering.gif'
import { checkSourceAlgoTx } from '@/scripts/algo/checkSourceAlgoTx'
import ShortTx from './ui/ShortTx.vue'
import { checkDestinationAlgoTx } from '@/scripts/algo/checkDestinationAlgoTx'
import FireworksEffect from './ui/FireworksEffect.vue'
import { AlgoConnectorType } from '@/scripts/interface/algo/AlgoConnectorType'
import { useWallet } from 'avm-wallet-vue'
import algosdk from 'algosdk'
import getAlgodClientByChainId from '@/scripts/algo/getAlgodClientByChainId'
import { useToast } from 'primevue/usetoast'
import MainActionButton from './ui/MainActionButton.vue'
import { getClaimTx } from '@/scripts/aramid/getClaimTx'
import { getTxClaimData } from '@/scripts/aramid/getTxClaimData'
import { resetStateSoft } from '@/scripts/common/resetStateSoft'

const store = useAppStore()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const { activeWallet } = useWallet()

const routeToReviewScreen = () => {
  console.log('routeToReviewScreen')
  console.log('route', route)
  router.push({ name: 'review-sc-dc-st-dt-sa-da-a-n' })
}

const checkSourceTx = async () => {
  console.log('checkSourceTx', store.state.claimTx, store.state.bridgeTx)
  if (!store.state.bridgeTx) {
    if (store.state.sourceChainConfiguration?.type == 'algo') {
      const txId = await checkSourceAlgoTx()
      if (txId) {
        store.state.bridgeTx = txId
      }
    }
  }
  if (!store.state.claimTx && store.state.bridgeTx) {
    if (store.state.destinationChainConfiguration?.type == 'eth') {
      const claimTx = await getClaimTx(store.state.bridgeTx)
      if (claimTx) {
        store.state.claimTx = claimTx
        console.log('claimTx', claimTx)
        const claimData = await getTxClaimData(claimTx)
        console.log('claimData', claimData)
        if (claimData) {
          store.state.claimData = claimData
        }
        router.push('/claim/' + store.state.bridgeTx)
      }
    }
    if (store.state.destinationChainConfiguration?.type == 'algo') {
      const txId = await checkDestinationAlgoTx()
      if (txId) {
        store.state.claimTx = txId
      }
    }
  }
}

const timerInterval = ref()

onMounted(async () => {
  makeNoteField()
  if (!store.state.publicConfiguration || !store.state.sourceAmount) {
    // route back to bridge screen
    routeToReviewScreen()
  }
  if (store.state.sourceChainConfiguration?.type == 'algo' && !store.state.sourceTxNote) {
    routeToReviewScreen()
  }

  timerInterval.value = setInterval(checkSourceTx.bind(this), 3000)
  checkSourceTx()

  if (store.state.sourceChainConfiguration?.type == 'algo' && store.state.sourceAlgoConnectorType == AlgoConnectorType.UseWallet) {
    // trigger the sign action
    await signWithUseWallet()
  }
})

const signWithUseWallet = async () => {
  try {
    if (!store.state.sourceChain) return
    if (!store.state.sourceToken) return
    if (!store.state.sourceAddress) return
    if (!store.state.sourceTxNote) return
    if (!activeWallet) throw Error('Use wallet is not initialized properly. Missing activeWallet')

    const algodClient = await getAlgodClientByChainId(store.state.sourceChain)
    if (!algodClient) throw Error('Algod client not initialized')
    const params = await algodClient.getTransactionParams().do()
    const tx =
      Number(store.state.sourceToken) > 0
        ? algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            amount: BigInt(store.state.sourceAmount),
            from: store.state.sourceAddress,
            to: store.state.sourceBridgeAddress,
            suggestedParams: params,
            note: new Uint8Array(Buffer.from(store.state.sourceTxNote)),
            assetIndex: Number(store.state.sourceToken)
          })
        : algosdk.makePaymentTxnWithSuggestedParamsFromObject({
            amount: BigInt(store.state.sourceAmount),
            from: store.state.sourceAddress,
            to: store.state.sourceBridgeAddress,
            suggestedParams: params,
            note: new Uint8Array(Buffer.from(store.state.sourceTxNote))
          })

    const signed = await activeWallet.value?.signTransactions([tx])
    if (signed && signed[0]) {
      await algodClient.sendRawTransaction(signed[0]).do()
      store.state.bridgeTx = tx.txID()
    }

    console.log('signed', signed)
  } catch (e: any) {
    console.error(e)
    toast.add({
      severity: 'error',
      detail: e.message ?? e,
      life: 3000
    })
  }
}

onBeforeUnmount(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
})

const resetButtonClick = async () => {
  resetStateSoft()
  console.log('resetButtonClick')
  store.state.claimData = undefined
  await router.push({ name: 'bridge-sc-dc-st-dt-sa-da-a-n' })
}
</script>

<template>
  <MainBox v-if="store && store.state && store.state.publicConfiguration && store.state.sourceAmount">
    <div class="w-[80vw] md:w-full flex flex-row gap-4 items-center mb-4">
      <div
        id="edit-button"
        class="px-2 items-center flex backdrop-blur-xl rounded-[80px] place-content-start select-none justify-between opacity-70 font-semibold text-[14px] cursor-pointer"
        style="border: 1px solid rgba(246, 246, 246, 0.16); background: rgba(246, 246, 246, 0.16)"
        @click="routeToReviewScreen"
      >
        <div class="flex flex-row-reverse items-center">
          <img alt="CaretLeftIcon" loading="lazy" width="20" height="20" decoding="async" src="../assets/images/CaretLeft.svg" style="color: transparent" />
        </div>
        Back
      </div>
      <div v-if="!store.state.bridgeTx" class="font-bold text-xl">Sign the transaction</div>
      <div v-else-if="store.state.bridgeTx && !store.state.claimTx" class="font-bold text-xl">The bridging process is underway</div>
      <div v-else-if="store.state.claimTx" class="font-bold text-xl">Successful bridging</div>
    </div>

    <StatusBar></StatusBar>
    <div v-if="!store.state.bridgeTx">
      <div v-if="store.state.sourceAlgoConnectorType == AlgoConnectorType.QRCode">
        <p>
          Make sure you send {{ store.state.sourceAmountFormatted }} {{ store.state.sourceTokenConfiguration?.name }}
          <span v-if="Number(store.state.sourceTokenConfiguration?.tokenId) > 0"> ({{ store.state.sourceTokenConfiguration?.tokenId }}) </span> to bridge address
          <WalletAddress :address="store.state.sourceBridgeAddress"></WalletAddress> <CopyIcon :text="store.state.sourceBridgeAddress"></CopyIcon> at the
          {{ store.state.sourceChainConfiguration?.name }} chain with note field <CopyIcon :text="store.state.sourceTxNote"></CopyIcon>
        </p>
        <div class="text-center">
          <p>Scan the QR Code with your wallet, or tap it to use the wallet on the same device.</p>
          <a v-if="store.state.qrContent" :href="`web+${store.state.qrContent}`" class="m-auto my-2" style="width: 200px; height: 200px; display: inline-block">
            <QRCodeVue3 :width="200" :height="200" :value="store.state.qrContent" myclass="m-auto" />
          </a>
        </div>
        <div class="text-center font-bold m-4">
          <img :src="loader" alt="Loading" height="18" width="18" class="inline-block" /> Please scan QR code, and send the transaction to the blockchain from your wallet
        </div>
      </div>
      <div v-if="store.state.sourceAlgoConnectorType == AlgoConnectorType.UseWallet" class="text-center font-bold m-4">
        <p><img :src="loader" alt="Loading" height="18" width="18" class="inline-block" /> Please sign your transaction in your {{ activeWallet?.name }} wallet</p>
      </div>
    </div>
    <div v-else-if="store.state.bridgeTx && !store.state.claimTx">
      <img :src="loader" alt="Loading" height="18" width="18" class="inline-block" /> This step usually takes less then 3 minutes. Your transaction ID:
      <ShortTx :txId="store.state.bridgeTx" :length="6" :chain="store.state.sourceChain"></ShortTx>
    </div>
    <div v-else-if="store.state.claimTx && store.state.destinationChainConfiguration?.type == 'algo'">
      <p>Bridging successful! The assets are at the destination account. TXN ID: <ShortTx :txId="store.state.claimTx" :length="6" :chain="store.state.destinationChain"></ShortTx></p>
      <FireworksEffect></FireworksEffect>
      <MainActionButton @click="resetButtonClick">Bridge again</MainActionButton>
    </div>
    <div v-else>
      <img :src="loader" alt="Loading" height="18" width="18" class="inline-block" /> Please wait a minute.
      <span v-if="store.state.bridgeTx">Your transaction ID: <ShortTx :txId="store.state.bridgeTx" :length="6" :chain="store.state.sourceChain"></ShortTx></span>
    </div>
  </MainBox>
</template>
