<script setup lang="ts">
import SimpleLabel from './ui/SimpleLabel.vue'
import DropDown from './ui/DropDown.vue'
import SelectSourceChainDialog from './dialogs/SelectSourceChainDialog.vue'

import { useAppStore } from '@/stores/app'
import getPublicConfiguration from '@/scripts/common/getPublicConfiguration'
import type { PublicConfigurationRoot } from '@/scripts/interface/mapping/PublicConfigurationRoot'
import type { ChainItem } from '@/scripts/interface/mapping/ChainItem'
import { onMounted, reactive } from 'vue'
import { useToast } from 'primevue/usetoast'
import { fillSourceChainConfiguration } from '@/scripts/events/fillSourceChainConfiguration'
import { useRoute } from 'vue-router'
const toast = useToast()
const store = useAppStore()
const route = useRoute()

interface IState {
  publicConfiguration: PublicConfigurationRoot | null
}
const state: IState = reactive({
  publicConfiguration: null,
  chain: store.state.sourceChainConfiguration as ChainItem
})
const fillInState = () => {
  try {
    if (!state.publicConfiguration) return
    if (!store.state.sourceChainConfiguration) {
      console.log("css route.params['sourceChain']", route.params['sourceChain'])
      fillSourceChainConfiguration(undefined, route.params['sourceChain'])
    }
  } catch (e: any) {
    console.error(e)
    toast.add({
      severity: 'error',
      detail: e.message ?? e,
      life: 3000
    })
  }
}
onMounted(async () => {
  state.publicConfiguration = await getPublicConfiguration(false)
  fillInState()
})
</script>
<template>
  <div>
    <SimpleLabel>Bridge from chain</SimpleLabel>
    <div class="w-full text-center place-content-center justify-items-center m-auto">
      <DropDown
        v-tooltip.top="'Select source blockchain from which you want to bridge your assets'"
        v-if="store.state.sourceChainConfiguration"
        :img="`logos/chains/${store.state.sourceChainConfiguration?.logo}.png`"
        :text="store.state.sourceChainConfiguration.name"
        @click="store.state.dialogSelectSourceChainIsOpen = true"
      ></DropDown>
    </div>
    <SelectSourceChainDialog></SelectSourceChainDialog>
  </div>
</template>
