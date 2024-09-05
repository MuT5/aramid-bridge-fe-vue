<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import CopyIcon from './ui/CopyIcon.vue'
import MainBox from './ui/MainBox.vue'
import WalletAddress from './ui/WalletAddress.vue'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StatusBar from './status/StatusBar.vue'
import QRCodeVue3 from 'qrcode-vue3'
import { makeNoteField } from '@/scripts/aramid/makeNoteField'

const store = useAppStore()
const route = useRoute()
const router = useRouter()

const getSourceChainImageUrl = () => {
  const ret = new URL(`../assets/logos/chains/${store.state.sourceChainConfiguration?.logo}.png`, import.meta.url)
  return ret.toString()
}
const getDestinationChainImageUrl = () => {
  const ret = new URL(`../assets/logos/chains/${store.state.destinationChainConfiguration?.logo}.png`, import.meta.url)
  return ret.toString()
}

const routeToReviewScreen = () => {
  console.log('route', route)
  router.push({ name: 'review-sc-dc-st-dt-sa-da-a-n' })
}

onMounted(() => {
  makeNoteField()
  if (!store.state.publicConfiguration || !store.state.sourceAmount || !store.state.sourceTxNote) {
    // route back to bridge screen
    routeToReviewScreen()
  }
})
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
      <div class="font-bold text-xl">Sign the transaction</div>
    </div>

    <StatusBar></StatusBar>
    <p>
      Make sure you send {{ store.state.sourceAmountFormatted }} {{ store.state.sourceTokenConfiguration?.name }}
      <span v-if="Number(store.state.sourceTokenConfiguration?.tokenId) > 0"> ({{ store.state.sourceTokenConfiguration?.tokenId }}) </span> to bridge address
      <WalletAddress :address="store.state.sourceBridgeAddress"></WalletAddress> <CopyIcon :text="store.state.sourceBridgeAddress"></CopyIcon> at the
      {{ store.state.sourceChainConfiguration?.name }} chain with note field <textarea rows="4" v-model="store.state.sourceTxNote" disabled class="w-full"></textarea> Copy note field:
      <CopyIcon :text="store.state.sourceTxNote"></CopyIcon>
    </p>
    <div class="text-center">
      <p>Scan the QR Code with your wallet, or tap it to use the wallet on the same device.</p>
      <a v-if="store.state.qrContent" :href="`web+${store.state.qrContent}`" class="m-auto my-2" style="width: 200px; height: 200px; display: inline-block">
        <QRCodeVue3 :width="200" :height="200" :value="store.state.qrContent" class="m-auto" />
      </a>
    </div>
  </MainBox>
</template>
