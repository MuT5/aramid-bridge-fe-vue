<script setup lang="ts">
import { RouterView } from 'vue-router'
import Toast from 'primevue/toast'
import { Buffer } from 'buffer'

// @ts-ignore
window.Buffer = Buffer

window.global ||= window
</script>

<template>
  <div id="app2" class="h-[100vh] flex flex-col text-gray-100 md:text-lg md:min-h-screen md:min-w-[550px] min-w-max">
    <Toast />
    <RouterView />
  </div>
</template>
