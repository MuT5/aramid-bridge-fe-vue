<script setup lang="ts">
import SimpleLabel from './ui/SimpleLabel.vue'
import SelectSourceWalletAlgoDialog from './dialogs/SelectSourceWalletAlgoDialog.vue'

import { useAppStore } from '@/stores/app'
import getPublicConfiguration from '@/scripts/common/getPublicConfiguration'
import type { PublicConfigurationRoot } from '@/scripts/interface/mapping/PublicConfigurationRoot'
import type { ChainItem } from '@/scripts/interface/mapping/ChainItem'
import { onMounted, reactive, watch } from 'vue'
import RoundButton from './ui/RoundButton.vue'
import { AlgoConnectorType } from '@/scripts/interface/algo/AlgoConnectorType'
import { useToast } from 'primevue/usetoast'
import { fillSourceTokenConfiguration } from '@/scripts/events/fillSourceTokenConfiguration'
import getAlgoAccountTokenBalance from '@/scripts/algo/getAlgoAccountTokenBalance'
const toast = useToast()
const store = useAppStore()

interface IState {
  connected: boolean
  publicConfiguration: PublicConfigurationRoot | null
}
const state: IState = reactive({
  connected: false,
  publicConfiguration: null,
  chain: store.state.sourceChainConfiguration as ChainItem
})

const fillInState = () => {
  try {
    fillSourceTokenConfiguration()
  } catch (e: any) {
    console.error(e)
    toast.add({
      severity: 'error',
      detail: e.message ?? e,
      life: 3000
    })
  }
}

const onSourceAddressChange = async () => {
  // refresh balance of source account
  if (!store.state.sourceChain) return
  if (!store.state.sourceChainConfiguration) return
  if (!store.state.sourceAddress) return
  if (store.state.sourceChainConfiguration.type == 'algo') {
    const balance = await getAlgoAccountTokenBalance(store.state.sourceChain, store.state.sourceAddress, Number(store.state.sourceToken))
    if (balance !== null) {
      store.state.sourceAddressBalance = balance.toString()
      console.log('onSourceAddressChange.balance', store.state.sourceAddressBalance, store.state.sourceChain, store.state.sourceAddress, Number(store.state.sourceToken))
    }
  }
}

onMounted(async () => {
  state.publicConfiguration = await getPublicConfiguration(false)
  fillInState()
})

watch(
  () => store.state.sourceChain,
  () => {
    fillInState()
  }
)
watch(
  () => store.state.sourceChainConfiguration,
  () => {
    fillInState()
  }
)

watch(
  () => store.state.connectedSourceChain,
  () => {
    state.connected = !!store.state.connectedSourceChain && !!store.state.sourceAddress
  }
)
watch(
  () => store.state.sourceAddress,
  async () => {
    await onSourceAddressChange()
  }
)
const buttonClick = () => {
  if (state.connected) {
    // disconnect
    switch (store.state.sourceAlgoConnectorType) {
      case AlgoConnectorType.QRCode:
        store.state.connectedSourceChain = undefined
        store.state.sourceAddress = ''
        break
    }
  } else {
    store.state.dialogSelectSourceWalletAVMIsOpen = true
  }
}
const getImageUrl = () => {
  if (state.connected) {
    const ret = new URL(`../assets/images/WalletConnected.svg`, import.meta.url)
    return ret.toString()
  } else {
    const ret = new URL(`../assets/images/Wallet.svg`, import.meta.url)
    return ret.toString()
  }
}
</script>
<template>
  <div>
    <SimpleLabel>Source wallet</SimpleLabel>
    <RoundButton
      v-tooltip.top="
        'Before proceeding you have to connect your wallet.\nIf you connect your wallet we will prefil your source account.\nOn AVM chains you can use QR payment option to initiate bridging. For this you need just to fill in your account address.'
      "
      v-if="store.state.sourceTokenConfiguration"
      :img="`logos/tokens/${store.state.sourceTokenConfiguration?.logo}.png`"
      :text="store.state.sourceTokenConfiguration.name"
      @click="buttonClick"
    >
      <img alt="wallet" loading="lazy" width="20" height="20" decoding="async" data-nimg="1" class="3xl:w-14 3xl:h-14" :src="getImageUrl()" style="color: transparent" />
      <div class="mx-auto self-center text-[14px] font-bold text-center 3xl:text-xl 4xl:text-2xl truncate" v-if="state.connected">Source wallet connected</div>
      <div class="mx-auto self-center text-[14px] font-bold text-center 3xl:text-xl 4xl:text-2xl truncate" v-else>Connect source wallet</div>
    </RoundButton>
    <SelectSourceWalletAlgoDialog></SelectSourceWalletAlgoDialog>
  </div>
</template>
