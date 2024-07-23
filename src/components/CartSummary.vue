<script setup>
defineProps({
  cartPrice: { type: String, required: false },
});
</script>

<template>
  <div
    class="w-full h-full max-w-[350px] bg-[#BEBEBE]/20 p-8 flex flex-col gap-5 rounded-lg"
  >
    <span class="text-xl font-bold tracking-wider">Summary</span>
    <div class="w-auto h-auto flex flex-col gap-2.5">
      <slot name="cartItems" />
      <div class="w-full flex justify-between">
        <span class="text-lg font-bold">Total</span>
        <span class="text-lg font-bold text-[#0B6BDA]">{{ cartPrice }} €</span>
      </div>
    </div>
    <slot name="button" />
  </div>
</template>
