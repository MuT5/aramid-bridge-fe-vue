<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const props = defineProps({ text: String, title: String })

const copy = async () => {
  try {
    await navigator.clipboard.writeText(props.text ?? '')
    toast.add({
      severity: 'info',
      detail: `Copied to clipboard: ${props.text}`,
      life: 3000
    })
  } catch ($e) {
    toast.add({
      severity: 'error',
      detail: 'Cannot copy',
      life: 3000
    })
  }
}
</script>

<template>
  <img
    @click="copy"
    v-tooltip.top="props.title ?? `Copy: '${props.text}'`"
    class="cursor-pointer m-auto inline-block"
    alt="CopyIcon"
    loading="lazy"
    width="20"
    height="20"
    decoding="async"
    src="../../assets/images/CopySimple.svg"
    style="color: transparent"
  />
</template>
