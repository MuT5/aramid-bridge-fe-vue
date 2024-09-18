<script setup lang="ts">
import PageFooter from '../components/PageFooter.vue'
import ClaimPage from '../components/ClaimPage.vue'
</script>

<template>
  <main class="flex flex-col h-full">
    <div class="flex flex-col flex-1">
      <ClaimPage></ClaimPage>
    </div>
    <PageFooter />
  </main>
</template>
