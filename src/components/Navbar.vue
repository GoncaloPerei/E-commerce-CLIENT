

<template>
  <div
    class="z-[999] sticky top-0 w-1/5 p-7 h-screen bg-[#BEBEBE]/20 flex flex-col gap-3.5 transition-all duration-500 ease-in-out overflow-x-auto justify-between"
  >
    <div class="flex flex-col gap-8 pb-3.5">
      <slot name="Logo"/>
      <div class="flex flex-col gap-3.5 py-2.5">
        <slot name="NavCards" />
      </div>
    </div>
    <slot name="UserCard" />
  </div>
</template>
