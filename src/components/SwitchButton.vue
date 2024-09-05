<script setup lang="ts">
import calculateFeeAndDestinationAmount from '@/scripts/common/calculateFeeAndDestinationAmount'
import { useAppStore } from '@/stores/app'
const store = useAppStore()
const switchClick = () => {
  const currSourceChain = store.state.sourceChain
  store.state.sourceChain = store.state.destinationChain
  store.state.destinationChain = currSourceChain
  const currSourceChainConfiguration = store.state.sourceChainConfiguration
  store.state.sourceChainConfiguration = store.state.destinationChainConfiguration
  store.state.destinationChainConfiguration = currSourceChainConfiguration

  const currSourceAddress = store.state.sourceAddress
  store.state.sourceAddress = store.state.destinationAddress
  store.state.destinationAddress = currSourceAddress

  const currSourceToken = store.state.sourceToken
  store.state.sourceToken = store.state.destinationToken
  store.state.destinationToken = currSourceToken
  const currSourceTokenConfiguration = store.state.sourceTokenConfiguration
  store.state.sourceTokenConfiguration = store.state.destinationTokenConfiguration
  store.state.destinationTokenConfiguration = currSourceTokenConfiguration

  const currConnectedChain = store.state.connectedSourceChain
  store.state.connectedSourceChain = store.state.connectedDestinationChain
  store.state.connectedDestinationChain = currConnectedChain

  calculateFeeAndDestinationAmount()
}
</script>
<template>
  <div class="text-[12px] text-center 3xl:text-xl 4xl:text-2xl my-2">Origin</div>
  <div class="flex flex-row items-center justify-between">
    <hr class="h-px my-6 w-4/12 md:w-7/12 bg-[#F6F6F629] border-0 dark:bg-gray-700" />
    <div class="w-10 p-2 cursor-pointer bg-[#190B29] border-[#FB7EFF99] border-2 rounded-full hover:bg-white-0.2" @click="switchClick">
      <span>
        <img
          color="red"
          id="reverse-button"
          alt="reverse"
          title="Reverse the direction"
          loading="lazy"
          width="20"
          height="20"
          decoding="async"
          data-nimg="1"
          class="h-20 w-20"
          src="@/assets/images/swapData.svg"
          style="color: transparent; width: 100%; height: auto"
        />
      </span>
    </div>
    <hr class="h-px my-6 w-4/12 md:w-7/12 bg-[#F6F6F629] border-0 dark:bg-gray-700" />
  </div>
  <div class="text-[12px] text-center 3xl:text-xl 4xl:text-2xl my-2">Destination</div>
</template>
