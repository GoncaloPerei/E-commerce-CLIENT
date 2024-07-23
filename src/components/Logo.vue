<script setup>
defineProps({
  link: { type: String, required: true },
});
</script>

<template>
  <RouterLink :to="link" class="flex gap-2.5 items-center">
    <b-icon-basket3-fill  class="text-[#0B6BDA] text-2xl"/>
    <hr class="w-px h-full bg-black"/>
    <p class="font-extrabold text-lg underline underline-offset-4 tracking-wider">E-commerce</p>
  </RouterLink>
</template>
