<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import AssetButton from '../ui/AssetButton.vue'
import getPublicConfiguration from '@/scripts/common/getPublicConfiguration'
import { onMounted, reactive, watch } from 'vue'
import type { PublicConfigurationRoot } from '@/scripts/interface/mapping/PublicConfigurationRoot'
import type { TokenItem } from '@/scripts/interface/mapping/TokenItem'
import { fillDestinationTokenConfiguration } from '@/scripts/events/fillDestinationTokenConfiguration'
import { fillSourceTokenConfiguration } from '@/scripts/events/fillSourceTokenConfiguration'
import { resetSourceTokenIfNotMatched } from '@/scripts/events/resetSourceTokenIfNotMatched'
import DialogTitle from '../ui/DialogTitle.vue'
import { fillRouteInfo } from '@/scripts/events/fillRouteInfo'

const store = useAppStore()

const assetButtonClick = (tokenId: string) => {
  fillDestinationTokenConfiguration(tokenId)

  resetSourceTokenIfNotMatched()
  if (!store.state.sourceToken) {
    fillSourceTokenConfiguration()
  }
  fillRouteInfo()
  store.state.dialogSelectDestinationAssetIsOpen = false
}

interface IState {
  publicConfiguration: PublicConfigurationRoot | null
  assets: TokenItem[] | null
}
const state: IState = reactive({
  publicConfiguration: null,
  assets: null
})
const fillInState = () => {
  if (!state.publicConfiguration) return
  if (!store.state.sourceChain) return
  if (!store.state.destinationChain) return

  // state.publicConfiguration.chains2tokens[store.state.sourceChain.toString()][
  //   store.state.destinationChain.toString()
  // ]

  if (
    state.publicConfiguration.chains2tokens[store.state.sourceChain.toString()] &&
    state.publicConfiguration.chains2tokens[store.state.sourceChain.toString()][store.state.destinationChain.toString()] &&
    store.state.sourceToken
  ) {
    const allowedRoutes = Object.keys(state.publicConfiguration.chains2tokens[store.state.sourceChain.toString()][store.state.destinationChain.toString()][store.state.sourceToken])
    console.log('allowedRoutes', allowedRoutes)
    state.assets = Object.values(state.publicConfiguration.chains[store.state.destinationChain.toString()].tokens).filter((c) => allowedRoutes.includes(c.tokenId))
  } else {
    state.assets = Object.values(state.publicConfiguration.chains[store.state.destinationChain.toString()].tokens)
  }
}
onMounted(async () => {
  state.publicConfiguration = await getPublicConfiguration(false)
  console.log('select destination asset dialog onmounted')
  fillInState()
})

watch(
  () => store.state.sourceToken,
  () => {
    fillInState()
  }
)

watch(
  () => store.state.destinationChainConfiguration,
  () => {
    fillInState()
  }
)
</script>
<template>
  <div :class="store.state.dialogSelectDestinationAssetIsOpen ? '' : 'hidden'">
    <div class="full-screen backdrop-blur-sm z-[100]" @click="store.state.dialogSelectDestinationAssetIsOpen = false"></div>
    <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col z-[101]">
      <ul class="bg-gradient-to-r from-topleft-purple to-bottomright-purple drop-shadow-menu-default rounded-[26px] p-3">
        <DialogTitle>Select asset which you want to receive on other chain</DialogTitle>

        <AssetButton v-for="(item, index) in state.assets" :key="index" :img="item.logo" :text="item.name" :id="item.tokenId" @click="assetButtonClick(item.tokenId)"></AssetButton>
      </ul>
    </div>
  </div>
</template>
