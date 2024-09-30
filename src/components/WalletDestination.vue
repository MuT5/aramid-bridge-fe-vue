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
import SelectDestinationWalletDialog from './dialogs/SelectDestinationWalletDialog.vue'
import getEthAccountTokenBalance from '@/scripts/eth/getEthAccountTokenBalance'
import getWeb3Modal from '@/scripts/eth/getWeb3Modal'
import asyncdelay from '@/scripts/common/asyncDelay'
import { useWeb3ModalAccount } from '@web3modal/ethers/vue'
import { useToast } from 'primevue/usetoast'
import { useWallet } from 'avm-wallet-vue'
import { AlgoConnectorType } from '@/scripts/interface/algo/AlgoConnectorType'
const store = useAppStore()
const toast = useToast()
const { setActiveNetwork, avmActiveWallet, activeAccount } = useWallet()
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
  console.log('WalletDestination.activeAccount.value', avmActiveWallet.value, activeAccount.value)
  if (store.state.destinationChainConfiguration?.type == 'algo' && avmActiveWallet.value && activeAccount.value?.address) {
    store.state.destinationAddress = activeAccount.value?.address
    store.state.connectedDestinationChain = store.state.destinationChain
  }

  fillInState()
})

watch(
  () => store.state.destinationAddress,
  () => {
    fillInState()
  }
)
const buttonClick = async () => {
  if (state.connected) {
    // disconnect
    store.state.destinationAddress = ''
  } else {
    if (store.state.sourceChainConfiguration?.type && store.state.sourceChainConfiguration?.type == store.state.destinationChainConfiguration?.type) {
      store.state.dialogSelectDestinationWalletIsOpen = true
    } else if (store.state.destinationChainConfiguration?.type == 'algo') {
      store.state.dialogSelectDestinationWalletAVMIsOpen = true
    } else if (store.state.destinationChainConfiguration?.type == 'eth') {
      // select address from wc
      const modal = getWeb3Modal()
      const { address, chainId, isConnected } = useWeb3ModalAccount()

      if (isConnected.value && address.value) {
        store.state.connectedDestinationChain = store.state.destinationChain
        store.state.destinationAddress = address.value
      } else {
        await modal?.open()
        console.log('0x2 address is ', isConnected.value, address.value, new Date())
        if (isConnected.value && address.value) {
          store.state.connectedDestinationChain = store.state.destinationChain
          store.state.destinationAddress = address.value
          return
        }
        await asyncdelay(1000)
        console.log('0x3 address is ', isConnected.value, address.value, new Date())
        if (isConnected.value && address.value) {
          store.state.connectedDestinationChain = store.state.destinationChain
          store.state.destinationAddress = address.value
          return
        }
        await asyncdelay(5000)
        console.log('0x4 address is ', isConnected.value, address.value, new Date())
        if (isConnected.value && address.value) {
          store.state.connectedDestinationChain = store.state.destinationChain
          store.state.destinationAddress = address.value
          return
        }
        await asyncdelay(10000)
        console.log('0x5 address is ', isConnected.value, address.value, new Date())
        if (isConnected.value && address.value) {
          store.state.connectedDestinationChain = store.state.destinationChain
          store.state.destinationAddress = address.value
          return
        }
      }
    }
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
    try {
      // check the bridge account
      store.state.loadingDestinationEscrowAddressBalance = true
      const balance = await getAlgoAccountTokenBalance(store.state.destinationChain, store.state.destinationBridgeAddress, Number(store.state.destinationToken))
      console.log('onDestinationAddressChange', balance)
      if (balance) {
        store.state.destinationBridgeBalance = balance.toFixed(0, 1)
      } else {
        store.state.destinationBridgeBalance = '0'
      }
      store.state.loadingDestinationEscrowAddressBalance = false
    } catch (e: any) {
      store.state.destinationBridgeBalance = '0'
      store.state.loadingDestinationEscrowAddressBalance = false
      console.error(e)
      toast.add({
        severity: 'error',
        detail: e.message,
        life: 3000
      })
      return false
    }
    try {
      store.state.loadingDestinationAddressBalance = true
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
      store.state.loadingDestinationAddressBalance = false
    } catch (e: any) {
      store.state.loadingDestinationAddressBalance = false
      store.state.destinationAddressBalance = '0'
      console.error(e)
      toast.add({
        severity: 'error',
        detail: e.message,
        life: 3000
      })
      return false
    }
  }
  if (store.state.destinationChainConfiguration.type == 'eth' && store.state.destinationToken) {
    // check the bridge account
    try {
      store.state.loadingDestinationEscrowAddressBalance = true
      const bridgeBalance = await getEthAccountTokenBalance(store.state.destinationChain, store.state.destinationBridgeAddress, store.state.destinationToken)
      console.log('onDestinationAddressChange', bridgeBalance)
      if (bridgeBalance) {
        store.state.destinationBridgeBalance = bridgeBalance.toFixed(0, 1)
      } else {
        store.state.destinationBridgeBalance = '0'
      }
      store.state.loadingDestinationEscrowAddressBalance = false
    } catch (e: any) {
      store.state.destinationBridgeBalance = '0'
      store.state.loadingDestinationEscrowAddressBalance = false
      console.error(e)
      toast.add({
        severity: 'error',
        detail: e.message,
        life: 3000
      })
      return false
    }
    try {
      store.state.loadingDestinationAddressBalance = true
      const balance = await getEthAccountTokenBalance(store.state.destinationChain, store.state.destinationAddress, store.state.destinationToken)
      if (balance !== null) {
        store.state.destinationAddressBalance = balance.toString()
        console.log('onDestinationAddressChange.balance', store.state.destinationAddressBalance, store.state.destinationChain, store.state.destinationAddress, store.state.destinationToken)
      } else {
        store.state.destinationAccountOptedIn = true
        store.state.destinationAddressBalance = '0'
      }
      store.state.loadingDestinationAddressBalance = false
    } catch (e: any) {
      store.state.loadingDestinationAddressBalance = false
      store.state.destinationAddressBalance = '0'
      console.error(e)
      toast.add({
        severity: 'error',
        detail: e.message,
        life: 3000
      })
      return false
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
        'Select the address that will receive the assets on the destination blockchain.\n You don’t need to own the account. On AVM chains (Algorand, Voi), the destination address must opt-in to the bridged assets. On EVM chains, the destination wallet must be connected to claim the bridged assets.'
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
    <SelectDestinationWalletDialog></SelectDestinationWalletDialog>
    <SelectDestinationWalletAlgoDialog v-if="store.state.destinationChainConfiguration?.type == 'algo'"></SelectDestinationWalletAlgoDialog>
  </div>
</template>
