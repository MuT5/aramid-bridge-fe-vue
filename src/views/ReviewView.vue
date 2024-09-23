<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import PageFooter from '../components/PageFooter.vue'
import ReviewPage from '../components/ReviewPage.vue'
import getPublicConfiguration from '@/scripts/common/getPublicConfiguration'
import MainBox from '@/components/ui/MainBox.vue'
import loader from '@/assets/images/loading-buffering.gif'
const state = reactive({
  loaded: false
})

onMounted(async () => {
  await getPublicConfiguration(true)
  state.loaded = true
})
</script>

<template>
  <main class="flex flex-col h-full">
    <div class="flex flex-col flex-1" v-if="state.loaded">
      <ReviewPage></ReviewPage>
    </div>
    <div class="flex flex-col flex-1" v-else>
      <MainBox><img :src="loader" alt="Loading" height="18" width="18" class="inline-block" /> Loading bridge configuration. Please wait a second please. </MainBox>
    </div>
    <PageFooter />
  </main>
</template>
