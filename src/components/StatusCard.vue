<script setup>
defineProps({
  order: { type: Object, required: true },
});
</script>

<template>
  <span
    :class="{
      'py-3 px-5 rounded-md tracking-wider font-bold': true,
      'bg-[#008000]/20': order?.payment?.status.id === 1,
      'bg-yellow-500/20': order?.payment?.status.id === 2,
      'bg-red-500/20': order?.payment?.status.id === 3,
    }"
  >
    {{ order?.payment?.status?.name }}
  </span>
</template>
