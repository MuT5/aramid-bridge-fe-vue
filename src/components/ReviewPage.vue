CopyIcon
<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import CopyIcon from './ui/CopyIcon.vue'
import MainBox from './ui/MainBox.vue'
import WalletAddress from './ui/WalletAddress.vue'
import { onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import StatusBar from './status/StatusBar.vue'
import MainActionButton from './ui/MainActionButton.vue'
import { AlgoConnectorType } from '@/scripts/interface/algo/AlgoConnectorType'
import base64url from 'base64url'
import getWeb3Modal from '@/scripts/eth/getWeb3Modal'
import { useSwitchNetwork, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/vue'
import { useToast } from 'primevue/usetoast'
import { executeEthApproveTx } from '@/scripts/eth/executeEthApproveTx'
import { executeEthLockTokensTx } from '@/scripts/eth/executeEthLockTokensTx'
import loader from '@/assets/images/loading-buffering.gif'
import ShortTx from './ui/ShortTx.vue'
const store = useAppStore()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const state = reactive({
  inApproval: false,
  inApprovalMinting: false,
  approvalHash: '',
  approved: false,
  inSign: false,
  inSignMinting: false,
  signHash: ''
})

const getSourceChainImageUrl = () => {
  const ret = new URL(`../assets/logos/chains/${store.state.sourceChainConfiguration?.logo}.png`, import.meta.url)
  return ret.toString()
}
const getDestinationChainImageUrl = () => {
  const ret = new URL(`../assets/logos/chains/${store.state.destinationChainConfiguration?.logo}.png`, import.meta.url)
  return ret.toString()
}

const routeToBridgeScreen = () => {
  console.log('route', route)
  if (route.name == 'review-sc-dc-st-dt-a-n') {
    router.push({ name: 'bridge-sc-dc-st-dt-a-n' })
  }
  if (route.name == 'review-sc-dc-st-dt-sa-da-a-n') {
    router.push({ name: 'bridge-sc-dc-st-dt-sa-da-a-n' })
  }
}

onMounted(() => {
  const modal = getWeb3Modal()
  console.log('modal', modal)
  if (!store.state.publicConfiguration || !store.state.sourceAmount) {
    // route back to bridge screen
    routeToBridgeScreen()
  }
  store.state.bridgeTx = undefined
  store.state.claimTx = undefined
  if (!store.state.memo) store.state.memo = 'aramid'
})

const signButtonClick = async () => {
  try {
    if (!store.state.sourceChainConfiguration) throw Error('store.state.sourceChainConfiguration is missing')

    await router.push({
      name: 'sign-n',
      params: {
        sourceChain: store.state.sourceChainConfiguration.name,
        destinationChain: store.state.destinationChainConfiguration?.name,
        sourceToken: store.state.sourceTokenConfiguration?.name,
        destinationToken: store.state.destinationTokenConfiguration?.name,
        sourceAmount: store.state.sourceAmount,
        note: base64url(store.state.memo ?? 'aramid-fe-2'),
        sourceAddress: store.state.sourceAddress,
        destinationAddress: store.state.destinationAddress
      }
    })
  } catch (e: any) {
    console.error(e)
    toast.add({
      severity: 'error',
      detail: e.message ?? e,
      life: 10000
    })
  }
}

const approveButtonClick = async () => {
  try {
    console.log('approveButtonClick')
    if (!store.state.sourceChainConfiguration) throw Error('store.state.sourceChainConfiguration is missing')
    state.inApproval = true
    const web3ModalProvider = useWeb3ModalProvider()
    const { switchNetwork } = useSwitchNetwork()
    const { address, chainId, isConnected } = useWeb3ModalAccount()
    if (!web3ModalProvider.walletProvider.value) {
      const modal = getWeb3Modal()
      console.log('modal', modal)
      await modal?.open()
    }
    if (!web3ModalProvider.walletProvider.value) {
      throw Error(`Please connect ${store.state.sourceChainConfiguration?.name} in your wallet`)
    }
    if (store.state.sourceChain) {
      console.log('chainId.value ? store.state.sourceChain', chainId.value, store.state.sourceChain)
      if (chainId.value != store.state.sourceChain) {
        //provider.open()
        toast.add({
          severity: 'warn',
          detail: `Please switch to ${store.state.sourceChainConfiguration?.name} in your wallet`,
          life: 10000
        })
        await switchNetwork(store.state.sourceChain)
      }
    }

    const approveInfo = await executeEthApproveTx()
    console.log('approveInfo', approveInfo)
    state.approvalHash = approveInfo.hash
    state.inApproval = false
    state.inApprovalMinting = true
    await approveInfo.wait()
    state.inApprovalMinting = false

    if (approveInfo.hash) {
      state.approved = true
    } else {
      return
    }
    await lockButtonClick()
  } catch (e: any) {
    state.inApproval = false
    state.inApprovalMinting = false
    state.inSign = false
    console.error(e)
    toast.add({
      severity: 'error',
      detail: e.message ?? e,
      life: 10000
    })
  }
}

const lockButtonClick = async () => {
  try {
    console.log('lockButtonClick')
    if (!store.state.sourceChainConfiguration) throw Error('store.state.sourceChainConfiguration is missing')
    state.inSign = true
    const signInfo = await executeEthLockTokensTx()
    state.inSign = false
    state.signHash = signInfo.hash
    state.inSignMinting = true
    console.log('signInfo', signInfo)
    await signInfo.wait()
    state.inSignMinting = false
    if (signInfo.hash) {
      store.state.bridgeTx = signInfo.hash

      await router.push({
        name: 'bridging',
        params: {
          sourceChain: store.state.sourceChainConfiguration.name,
          destinationChain: store.state.destinationChainConfiguration?.name,
          sourceToken: store.state.sourceTokenConfiguration?.name,
          destinationToken: store.state.destinationTokenConfiguration?.name,
          sourceAmount: store.state.sourceAmount,
          note: base64url(store.state.memo ?? 'aramid-fe-2'),
          sourceAddress: store.state.sourceAddress,
          destinationAddress: store.state.destinationAddress
        }
      })
      return
    }
  } catch (e: any) {
    state.inSign = false
    state.inSignMinting = false
    console.error(e)
    toast.add({
      severity: 'error',
      detail: e.message ?? e,
      life: 10000
    })
  }
}
</script>

<template>
  <MainBox v-if="store && store.state && store.state.publicConfiguration && store.state.sourceAmount">
    <div class="w-[80vw] md:w-full flex flex-row gap-4 items-center mb-4">
      <div
        id="edit-button"
        class="px-2 items-center flex backdrop-blur-xl rounded-[80px] place-content-start select-none justify-between opacity-70 font-semibold text-[14px] cursor-pointer"
        style="border: 1px solid rgba(246, 246, 246, 0.16); background: rgba(246, 246, 246, 0.16)"
        @click="routeToBridgeScreen"
      >
        <div class="flex flex-row-reverse items-center">
          <img alt="CaretLeftIcon" loading="lazy" width="20" height="20" decoding="async" src="../assets/images/CaretLeft.svg" style="color: transparent" />
        </div>
        Back
      </div>
      <div class="font-bold text-xl">Review your transaction</div>
    </div>

    <div class="text-sm border border-bottom-1 border-[#F6F6F61A] border-x-0 w-full pb-8">
      <div class="flex flex-row mt-4">
        <div class="min-w-20">
          <div class="flex flex-col w-12 md:p-1.5 m-1 bg-[#15002E] border-[#FB7EFF99] border rounded-full m-auto">
            <img class="m-auto" color="red" id="reverse-button" alt="Source chain image" loading="lazy" width="50" height="50" decoding="async" :src="getSourceChainImageUrl()" />
          </div>
        </div>
        <div class="text-lg font-bold my-2 mr-4">{{ store.state.sourceChainConfiguration?.name }}</div>
        <hr class="h-[1px] my-6 w-full bg-[#F6F6F629] border-0 dark:bg-gray-700" />
        <div class="my-3 min-w-32 mx-auto text-center">Source chain</div>
        <hr class="h-[1px] my-6 w-full bg-[#F6F6F629] border-0 dark:bg-gray-700" />
      </div>
      <div class="flex flex-col md:flex-row mt-2 text-center md:text-left">
        <div class="min-w-20 hidden md:block text-center">
          <CopyIcon :text="store.state.sourceAmountFormatted" :title="`Copy amount: ${store.state.sourceAmountFormatted}`"></CopyIcon>
        </div>
        <div class="md:min-w-44 font-bold">Amount to send</div>
        <div class="w-full" :title="`Base amount: ${store.state.sourceAmount}`">{{ store.state.sourceAmountFormatted }}</div>
      </div>
      <div class="flex flex-col md:flex-row mt-2 text-center md:text-left">
        <div class="min-w-20 hidden md:block text-center">
          <CopyIcon :text="store.state.sourceTokenConfiguration?.name" :title="`Copy token name: ${store.state.sourceTokenConfiguration?.name}`"></CopyIcon>
        </div>
        <div class="md:min-w-44 font-bold">Token name</div>
        <div class="w-full">{{ store.state.sourceTokenConfiguration?.name }}</div>
      </div>
      <div class="flex flex-col md:flex-row mt-2 text-center md:text-left">
        <div class="min-w-20 hidden md:block text-center">
          <CopyIcon :text="store.state.sourceTokenConfiguration?.tokenId" :title="`Copy token id: ${store.state.sourceTokenConfiguration?.tokenId}`"></CopyIcon>
        </div>
        <div class="md:min-w-44 font-bold">Token id</div>
        <div class="w-full">{{ store.state.sourceTokenConfiguration?.tokenId }}</div>
      </div>
      <div class="flex flex-col md:flex-row mt-2 text-center md:text-left">
        <div class="min-w-20 hidden md:block text-center">
          <CopyIcon :text="store.state.sourceAddress" :title="`Copy source address: ${store.state.sourceAddress}`"></CopyIcon>
        </div>
        <div class="md:min-w-44 font-bold">Bridge from address</div>
        <div class="w-full block md:hidden">
          <WalletAddress :address="store.state.sourceAddress" :length="4"></WalletAddress>
        </div>
        <div class="w-full hidden md:block lg:hidden">
          <WalletAddress :address="store.state.sourceAddress" :length="6"></WalletAddress>
        </div>
        <div class="w-full hidden lg:block">
          <WalletAddress :address="store.state.sourceAddress" :length="30"></WalletAddress>
        </div>
      </div>
      <div class="flex flex-col md:flex-row mt-2 text-center md:text-left">
        <div class="min-w-20 hidden md:block text-center">
          <CopyIcon :text="store.state.sourceBridgeAddress" :title="`Copy source chain bridge address: ${store.state.sourceBridgeAddress}`"></CopyIcon>
        </div>
        <div class="md:min-w-44 font-bold">Bridge address</div>
        <div class="w-full block md:hidden">
          <WalletAddress :address="store.state.sourceBridgeAddress" :length="4"></WalletAddress>
        </div>
        <div class="w-full hidden md:block lg:hidden">
          <WalletAddress :address="store.state.sourceBridgeAddress" :length="6"></WalletAddress>
        </div>
        <div class="w-full hidden lg:block">
          <WalletAddress :address="store.state.sourceBridgeAddress" :length="30"></WalletAddress>
        </div>
      </div>

      <div class="flex flex-row mt-4">
        <div class="min-w-20">
          <div class="flex flex-col w-12 md:p-1.5 m-1 bg-[#15002E] border-[#FB7EFF99] border rounded-full m-auto">
            <img class="m-auto" color="red" id="reverse-button" alt="Destination chain image" loading="lazy" width="50" height="50" decoding="async" :src="getDestinationChainImageUrl()" />
          </div>
        </div>
        <div class="text-lg font-bold my-2 mr-4">{{ store.state.destinationChainConfiguration?.name }}</div>
        <hr class="h-[1px] my-6 w-full bg-[#F6F6F629] border-0 dark:bg-gray-700" />
        <div class="my-3 min-w-32 mx-auto text-center">Destination chain</div>
        <hr class="h-[1px] my-6 w-full bg-[#F6F6F629] border-0 dark:bg-gray-700" />
      </div>

      <div class="flex flex-col md:flex-row mt-2 text-center md:text-left">
        <div class="min-w-20 hidden md:block text-center">
          <CopyIcon :text="store.state.destinationAmountFormatted" :title="`Copy amount: ${store.state.destinationAmountFormatted}`"></CopyIcon>
        </div>
        <div class="md:min-w-44 font-bold">Amount to receive</div>
        <div class="w-full" :title="`Base amount: ${store.state.destinationAmount}`">{{ store.state.destinationAmountFormatted }}</div>
      </div>
      <div class="flex flex-col md:flex-row mt-2 text-center md:text-left">
        <div class="min-w-20 hidden md:block text-center">
          <CopyIcon :text="store.state.destinationTokenConfiguration?.name" :title="`Copy token name: ${store.state.destinationTokenConfiguration?.name}`"></CopyIcon>
        </div>
        <div class="md:min-w-44 font-bold">Receive token</div>
        <div class="w-full">{{ store.state.destinationTokenConfiguration?.name }}</div>
      </div>
      <div class="flex flex-col md:flex-row mt-2 text-center md:text-left">
        <div class="min-w-20 hidden md:block text-center">
          <CopyIcon :text="store.state.destinationTokenConfiguration?.tokenId" :title="`Copy token id: ${store.state.destinationTokenConfiguration?.tokenId}`"></CopyIcon>
        </div>
        <div class="md:min-w-44 font-bold">Token id</div>
        <div class="w-full">{{ store.state.destinationTokenConfiguration?.tokenId }}</div>
      </div>
      <div class="flex flex-col md:flex-row mt-2 text-center md:text-left">
        <div class="min-w-20 hidden md:block text-center">
          <CopyIcon :text="store.state.destinationAddress" :title="`Copy source address: ${store.state.destinationAddress}`"></CopyIcon>
        </div>
        <div class="md:min-w-44 font-bold">Receive assets to address</div>
        <div class="w-full block md:hidden">
          <WalletAddress :address="store.state.destinationAddress" :length="4"></WalletAddress>
        </div>
        <div class="w-full hidden md:block lg:hidden">
          <WalletAddress :address="store.state.destinationAddress" :length="6"></WalletAddress>
        </div>
        <div class="w-full hidden lg:block">
          <WalletAddress :address="store.state.destinationAddress" :length="30"></WalletAddress>
        </div>
      </div>
      <div class="flex flex-col md:flex-row mt-2 text-center md:text-left" v-if="store.state.memo">
        <div class="min-w-20 hidden md:block text-center">
          <CopyIcon :text="store.state.memo" :title="`Copy source address: ${store.state.memo}`"></CopyIcon>
        </div>
        <div class="md:min-w-44 font-bold">Data transfer</div>
        <div class="w-full">
          {{ store.state.memo }}
        </div>
      </div>
      <div class="flex flex-col md:flex-row mt-2 text-center md:text-left">
        <div class="min-w-20 hidden md:block text-center">
          <CopyIcon :text="store.state.destinationBridgeAddress" :title="`Copy destination chain bridge address: ${store.state.destinationBridgeAddress}`"></CopyIcon>
        </div>
        <div class="md:min-w-44 font-bold">Bridge address</div>
        <div class="w-full block md:hidden">
          <WalletAddress :address="store.state.destinationBridgeAddress" :length="4"></WalletAddress>
        </div>
        <div class="w-full hidden md:block lg:hidden">
          <WalletAddress :address="store.state.destinationBridgeAddress" :length="6"></WalletAddress>
        </div>
        <div class="w-full hidden lg:block">
          <WalletAddress :address="store.state.destinationBridgeAddress" :length="30"></WalletAddress>
        </div>
      </div>
    </div>
    <StatusBar></StatusBar>
    <MainActionButton @click="signButtonClick" v-if="store.state.sourceChainConfiguration?.type == 'algo'">Sign</MainActionButton>

    <div v-if="state.inApproval">
      <img :src="loader" alt="Loading" height="18" width="18" class="inline-block" /> Please check your wallet for approval transaction so that the bridge transaction is approved deduct from your
      account {{ store.state.sourceAmountFormatted }} {{ store.state.sourceTokenConfiguration?.name }}
    </div>
    <div v-if="state.inApprovalMinting">
      <img :src="loader" alt="Loading" height="18" width="18" class="inline-block" /> Your approval transaction is being minted at {{ store.state.sourceChainConfiguration?.name }}
      <span v-if="state.approvalHash"><ShortTx :txId="state.approvalHash" :length="6" :chain="store.state.sourceChain"></ShortTx></span>
    </div>
    <div v-if="state.inSign">
      <img :src="loader" alt="Loading" height="18" width="18" class="inline-block" /> Please check your wallet for bridge transaction so that the bridge can transfer
      {{ store.state.sourceAmountFormatted }} {{ store.state.sourceTokenConfiguration?.name }} to {{ store.state.destinationChainConfiguration?.name }}
      <span v-if="state.signHash"><ShortTx :txId="state.signHash" :length="6" :chain="store.state.sourceChain"></ShortTx></span>
    </div>
    <div v-if="state.inSignMinting">
      <img :src="loader" alt="Loading" height="18" width="18" class="inline-block" /> Your bridge transaction is being minted at {{ store.state.sourceChainConfiguration?.name }}
    </div>

    <MainActionButton @click="approveButtonClick" v-if="store.state.sourceChainConfiguration?.type == 'eth' && !state.approved">Approve</MainActionButton>
    <MainActionButton @click="lockButtonClick" v-if="store.state.sourceChainConfiguration?.type == 'eth' && state.approved">Sign bridge tx</MainActionButton>
  </MainBox>
</template>
