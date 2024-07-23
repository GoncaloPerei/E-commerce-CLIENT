<script setup>
defineProps({
  stock: { type: Number, required: true },
});
</script>

<template>
  <span
    v-if="stock === 0"
    class="flex gap-2.5 items-center font-bold text-sm text-red-500"
  >
    <b-icon-x-circle-fill />
    Not Available
  </span>
  <span
    v-if="stock <= 10 && stock > 0"
    class="flex gap-2.5 items-center font-bold text-sm text-yellow-500"
  >
    <b-icon-check-circle-fill />
    Low Stock
  </span>
  <span
    v-if="stock > 10"
    class="flex gap-2.5 items-center font-bold text-sm text-green-500"
  >
    <b-icon-check-circle-fill />
    In Stock
  </span>
</template>
