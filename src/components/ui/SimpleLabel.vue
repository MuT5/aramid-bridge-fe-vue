<script setup lang="ts">
const props = defineProps({ class: String })
</script>
<template>
  <div class="text-[14px] font-bold text-center 3xl:text-xl 4xl:text-2xl" :class="props.class">
    <slot />
  </div>
</template>
