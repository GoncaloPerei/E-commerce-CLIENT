<script setup>
defineProps({
  crudName: { type: String, required: true },
  newBtn: { type: String, required: true },
});
</script>

<template>
  <div
    class="relative w-screen h-screen px-5 py-6 flex flex-col gap-5 overflow-x-hidden overflow-y-auto"
  >
    <div class="w-full p-2.5 flex justify-between items-center">
      <span class="font-bold text-2xl tracking-wider">{{ crudName }}</span>
      <button
        @click="$emit('handleAdd')"
        class="bg-[#0B6BDA] rounded-full text-white tracking-wider font-bold px-5 py-5 hover:brightness-90 transition-all duration-300"
      >
        {{ newBtn }}
      </button>
      <slot name="newDialog" />
    </div>
    <div class="w-full h-auto p-2.5 flex justify-end gap-2.5">
      <slot name="searchBar" />
      <button
        @click="$emit('handleFilters')"
        class="px-3.5 py-4 flex gap-2.5 items-center border border-[#BEBEBE] rounded-lg text-[#0B6BDA] tracking-wider"
      >
        <b-icon-filter-left class="text-lg" />
        Filters
      </button>
    </div>
    <slot name="filtersOn" />
    <div class="w-full h-full flex items-center">
      <slot name="table" />
    </div>
  </div>
</template>
