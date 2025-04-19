<script setup lang="ts">
import { useAppStore } from '@/stores/app'
import AssetButton from '../ui/AssetButton.vue'
import getPublicConfiguration from '@/scripts/common/getPublicConfiguration'
import { onMounted, reactive, watch } from 'vue'
import type { PublicConfigurationRoot } from '@/scripts/interface/mapping/PublicConfigurationRoot'
import type { TokenItem } from '@/scripts/interface/mapping/TokenItem'
import { fillSourceTokenConfiguration } from '@/scripts/events/fillSourceTokenConfiguration'
import { resetDestinationTokenIfNotMatched } from '@/scripts/events/resetDestinationTokenIfNotMatched'
import { fillDestinationTokenConfiguration } from '@/scripts/events/fillDestinationTokenConfiguration'
import DialogTitle from '../ui/DialogTitle.vue'
import { fillRouteInfo } from '@/scripts/events/fillRouteInfo'
import { useRoute } from 'vue-router'

const store = useAppStore()
const route = useRoute()

const assetButtonClick = (tokenId: string) => {
  fillSourceTokenConfiguration(tokenId)

  resetDestinationTokenIfNotMatched()
  if (!store.state.destinationToken) {
    fillDestinationTokenConfiguration()
  }
  fillRouteInfo()
  store.state.dialogSelectSourceAssetIsOpen = false
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

  if (
    state.publicConfiguration.chains2tokens[store.state.sourceChain.toString()] &&
    state.publicConfiguration.chains2tokens[store.state.sourceChain.toString()][store.state.destinationChain.toString()]
  ) {
    const allowedRoutes = Object.keys(state.publicConfiguration.chains2tokens[store.state.sourceChain.toString()][store.state.destinationChain.toString()])
    state.assets = Object.values(state.publicConfiguration.chains[store.state.sourceChain.toString()].tokens).filter((c) => allowedRoutes.includes(c.tokenId))
  } else {
    state.assets = Object.values(state.publicConfiguration.chains[store.state.sourceChain.toString()].tokens)
  }
}
onMounted(async () => {
  state.publicConfiguration = await getPublicConfiguration(false)
  fillInState()
})
watch(
  () => store.state.sourceChainConfiguration,
  () => {
    fillInState()
  }
)
</script>
<template>
  <div :class="store.state.dialogSelectSourceAssetIsOpen ? '' : 'hidden'">
    <div class="full-screen backdrop-blur-sm z-[100]" @click="store.state.dialogSelectSourceAssetIsOpen = false"></div>
    <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col z-[101]">
      <ul class="bg-gradient-to-r from-topleft-purple to-bottomright-purple drop-shadow-menu-default rounded-[26px] p-3">
        <DialogTitle> Select asset which you want to bridge to other chain </DialogTitle>

        <div v-if="!state.assets?.length" class="text-white">No assets available</div>

        <template v-for="(item, index) in state.assets" :key="index">
          <AssetButton :img="item.logo" :text="item.name" :id="item.tokenId" @click="assetButtonClick(item.tokenId)" @error="console.log('Failed to load image for:', item.name)" />
        </template>
      </ul>
    </div>
  </div>
</template>
