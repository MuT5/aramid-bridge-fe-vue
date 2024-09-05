<script setup lang="ts">
import PageFooter from '../components/PageFooter.vue'
import BridgePage from '../components/BridgePage.vue'
</script>

<template>
  <main class="flex flex-col h-full">
    <div class="flex flex-col flex-1">
      <BridgePage></BridgePage>
    </div>
    <PageFooter />
  </main>
</template>
