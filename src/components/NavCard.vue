<script setup>
defineProps({
  iconName: { type: String, required: false },
  link: { type: String, required: true },
});
</script>

<template>
  <RouterLink :to="link" class="w-full h-fit flex items-center gap-4 px-4 py-5 rounded-md">
    <component :is="iconName" class="text-[#0B6BDA] text-xl" />
    <span class="text-lg tracking-wider"><slot /></span>
  </RouterLink>
</template>
