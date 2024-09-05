<script setup lang="ts">
import PageFooter from '../components/PageFooter.vue'
import SignPage from '../components/SignPage.vue'
</script>

<template>
  <main class="flex flex-col h-full">
    <div class="flex flex-col flex-1">
      <SignPage></SignPage>
    </div>
    <PageFooter />
  </main>
</template>
