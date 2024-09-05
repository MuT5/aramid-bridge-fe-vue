<template>
  <div
    class="self-center flex justify-center w-full h-[56px] 3xl:h-[80px] 4xl:h-[115px] bg-[#15002E] ease-in-out duration-100 cursor-pointer hover:bg-confirm-btn-grey-hover select-none rounded-[33px] 3xl:rounded-[46px] 4xl:rounded-[65px] border-[#8217BD] border-2 w-full mt-4 mx-4 px-4"
  >
    <div class="flex flex-col justify-center text-[#FCD4FF] font-bold text-xl 3xl:text-2xl 4xl:text-3xl">
      <slot />
    </div>
  </div>
</template>
