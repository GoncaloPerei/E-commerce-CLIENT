<script setup>
import { RouterLink } from "vue-router";
defineProps({
  iconName: { type: String, required: true },
  link: { type: String, required: true },
});
</script>

<template>
  <router-link
    :to="link"
    class="relative w-full flex flex-col border border-[#BEBEBE] rounded-xl font-montserrat overflow-hidden max-w-[500px]"
  >
    <div class="relative w-full justify-between items-center flex px-10 py-7">
      <span
        class="font-bold text-[#0B6BDA] text-2xl tracking-wider leading-relaxed"
      >
        <slot name="count" /><br />
        <span class="font-normal text-black text-lg"><slot name="name" /></span>
      </span>
      <div class="w-fit h-fit p-5 rounded-full bg-[#0B6BDA]">
        <component :is="iconName" class="text-3xl text-[#FFFFFF]" />
      </div>
    </div>
    <div
      class="w-full flex items-center gap-3.5 bg-[#0B6BDA]/40 bottom-0 px-10 py-1.5"
    >
      <span class="tracking-wider">More info...</span>
      <b-icon-arrow-right-circle-fill class="text-xl" />
    </div>
  </router-link>
</template>
