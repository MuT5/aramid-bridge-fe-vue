<script setup lang="ts">
import SimpleLabel from './ui/SimpleLabel.vue'
import SelectDestinationWalletAlgoDialog from './dialogs/SelectDestinationWalletAlgoDialog.vue'

import { useAppStore } from '@/stores/app'
import getPublicConfiguration from '@/scripts/common/getPublicConfiguration'
import type { PublicConfigurationRoot } from '@/scripts/interface/mapping/PublicConfigurationRoot'
import { onMounted, reactive, watch } from 'vue'
import RoundButton from './ui/RoundButton.vue'
import WalletAddress from './ui/WalletAddress.vue'
import getAlgoAccountTokenBalance from '@/scripts/algo/getAlgoAccountTokenBalance'
import getAlgoAccountTokenOptedIn from '@/scripts/algo/getAlgoAccountTokenOptedIn'
const store = useAppStore()

interface IState {
  connected: boolean
  publicConfiguration: PublicConfigurationRoot | null
}
const state: IState = reactive({
  connected: false,
  publicConfiguration: null
})

const fillInState = () => {
  state.connected = !!store.state.destinationAddress
}

onMounted(async () => {
  state.publicConfiguration = await getPublicConfiguration(false)
  fillInState()
})

watch(
  () => store.state.destinationAddress,
  () => {
    fillInState()
  }
)
const buttonClick = () => {
  if (state.connected) {
    // disconnect
    store.state.destinationAddress = ''
  } else {
    store.state.dialogSelectDestinationWalletAVMIsOpen = true
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

const onDestinationAddressChange = async () => {
  // refresh balance of source account
  if (!store.state.destinationChain) return
  if (!store.state.destinationChainConfiguration) return
  if (!store.state.destinationAddress) return
  if (store.state.destinationChainConfiguration.type == 'algo') {
    const optin = await getAlgoAccountTokenOptedIn(store.state.destinationChain, store.state.destinationAddress, Number(store.state.destinationToken))
    if (optin !== null) {
      store.state.destinationAccountOptedIn = optin

      const balance = await getAlgoAccountTokenBalance(store.state.destinationChain, store.state.destinationAddress, Number(store.state.destinationToken))
      if (balance !== null) {
        store.state.destinationAddressBalance = balance.toString()
        console.log('onDestinationAddressChange.balance', store.state.destinationAddressBalance, store.state.destinationChain, store.state.destinationAddress, Number(store.state.destinationToken))
      }
    } else {
      store.state.destinationAccountOptedIn = false
      store.state.destinationAddressBalance = '0'
    }

    // check the bridge account
    const balance = await getAlgoAccountTokenBalance(store.state.destinationChain, store.state.destinationBridgeAddress, Number(store.state.destinationToken))
    console.log('onDestinationAddressChange', balance)
    if (balance) {
      store.state.destinationBridgeBalance = balance.toFixed(0, 1)
    } else {
      store.state.destinationBridgeBalance = '0'
    }
  }
}

watch(
  () => store.state.destinationAddress,
  async () => {
    await onDestinationAddressChange()
  }
)
</script>
<template>
  <div>
    <SimpleLabel>Destination address</SimpleLabel>
    <RoundButton
      v-tooltip.top="
        'Select address which will receive the tokens at the destination chain.\nYou do not have to be owner of that account - you can pay for invoices, bridge some data, or send a donation.\nOn AVM chains (Algorand, Voi) the destination address must opt in to the bridged asset.'
      "
      v-if="store.state.destinationTokenConfiguration"
      :img="`logos/tokens/${store.state.destinationTokenConfiguration?.logo}.png`"
      :text="store.state.destinationTokenConfiguration.name"
      @click="buttonClick"
    >
      <img alt="wallet" loading="lazy" width="20" height="20" decoding="async" data-nimg="1" class="3xl:w-14 3xl:h-14" :src="getImageUrl()" style="color: transparent" />
      <div class="mx-auto self-center text-[14px] font-bold text-center 3xl:text-xl 4xl:text-2xl truncate" v-if="state.connected">
        <WalletAddress :address="store.state.destinationAddress"></WalletAddress>
      </div>
      <div class="mx-auto self-center text-[14px] font-bold text-center 3xl:text-xl 4xl:text-2xl truncate" v-else>Select dest. address</div>
    </RoundButton>
    <SelectDestinationWalletAlgoDialog></SelectDestinationWalletAlgoDialog>
  </div>
</template>
