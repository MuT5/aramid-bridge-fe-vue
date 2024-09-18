<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import getPublicConfiguration from '@/scripts/common/getPublicConfiguration'
import { onMounted, reactive } from 'vue'
import type { PublicConfigurationRoot } from '@/scripts/interface/mapping/PublicConfigurationRoot'
import type { ChainItem } from '@/scripts/interface/mapping/ChainItem'
import WalletAddress from '../ui/WalletAddress.vue'
import DialogTitle from '../ui/DialogTitle.vue'
import DialogButton from '../ui/DialogButton.vue'

const store = useAppStore()

interface IState {
  publicConfiguration: PublicConfigurationRoot | null
  chains: ChainItem[] | null
  addressInput: string
  step2: boolean
}
const state: IState = reactive({
  publicConfiguration: null,
  chains: null,
  addressInput: '',
  step2: false
})
onMounted(async () => {
  state.publicConfiguration = await getPublicConfiguration(false)
  if (!state.publicConfiguration) return

  state.chains = Object.keys(state.publicConfiguration.chains2tokens).map((c) => (state.publicConfiguration as PublicConfigurationRoot).chains[c])
})
const qrUrl = () => {
  const ret = new URL(`../../assets/images/qr-code.png`, import.meta.url)
  return ret.toString()
}

const sameAddressYesClick = () => {
  store.state.destinationAddress = store.state.sourceAddress
  store.state.connectedDestinationChain = store.state.destinationChainConfiguration?.chainId
  store.state.dialogSelectDestinationWalletIsOpen = false
}
const differentAddressClick = () => {
  if (store.state.sourceChainConfiguration?.type == 'algo') {
    store.state.dialogSelectDestinationWalletIsOpen = false
    store.state.dialogSelectDestinationWalletAVMIsOpen = true
  }
}

const closeDialog = () => {
  store.state.dialogSelectDestinationWalletIsOpen = false
}
</script>
<template>
  <div :class="store.state.dialogSelectDestinationWalletIsOpen ? '' : 'hidden'">
    <div class="fixed w-screen h-screen backdrop-blur-sm z-[100]" style="top: 50%; left: 50%; transform: translate(-50%, -50%)" @click="closeDialog"></div>
    <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col z-[101]">
      <ul class="bg-gradient-to-r from-topleft-purple to-bottomright-purple drop-shadow-menu-default rounded-[26px] p-3">
        <DialogTitle>Choose destination wallet</DialogTitle>
        <div v-if="store.state.sourceAddress">
          <div>Do you want to use address <WalletAddress :address="store.state.sourceAddress"></WalletAddress>?</div>
          <DialogButton @click="sameAddressYesClick">Yes</DialogButton>
          <DialogButton @click="differentAddressClick">No</DialogButton>
        </div>
        <div v-else>Please select the source address first</div>
      </ul>
    </div>
  </div>
</template>
