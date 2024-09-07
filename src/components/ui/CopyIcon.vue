<script setup lang="ts">
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const props = defineProps({ text: String, title: String })

const copy = async () => {
  try {
    await navigator.clipboard.writeText(props.text ?? '')
    const note = props.text && props.text?.length > 50 ? `${props.text?.substring(0, 50)}...` : props.text
    toast.add({
      severity: 'info',
      detail: `Copied to clipboard: ${note}`,
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
const title = () => {
  if (props.title) return props.title
  if (props.text && props.text?.length > 100) {
    return `Copy: '${props.text?.substring(0, 100)}...'`
  }
  return props.text
}
</script>

<template>
  <img
    @click="copy"
    v-tooltip.top="title()"
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
