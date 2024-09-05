<script setup lang="ts">
import PageFooter from '../components/PageFooter.vue'
import ReviewPage from '../components/ReviewPage.vue'
</script>

<template>
  <main class="flex flex-col h-full">
    <div class="flex flex-col flex-1">
      <ReviewPage></ReviewPage>
    </div>
    <PageFooter />
  </main>
</template>
