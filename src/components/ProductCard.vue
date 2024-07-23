<script setup>
import { RouterLink } from "vue-router";
import StockCard from "@/components/StockCard.vue";

defineProps({
  title: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
  stock: { type: Number, required: true },
  link: { type: String, required: false },
});
</script>

<template>
  <RouterLink
    :to="link"
    class="w-full h-full bg-[#BEBEBE]/20 p-6 flex flex-col justify-between gap-2.5 items-center max-w-[350px] max-h-[350px] rounded-lg"
  >
    <div class="w-full h-auto overflow-hidden">
      <span
        class="font-bold text-sm tracking-wider text-wrap line-clamp-2 truncate"
        >{{ title }}</span
      >
      <span class="text-sm font-bold text-[#0B6BDA]">{{ price }} €</span>
    </div>
    <img
      :src="image"
      :alt="title"
      class="w-max max-w-40 max-h-40 rounded-lg"
      decoding="async"
      loading="lazy"
    />
    <StockCard :stock="stock"/>
  </RouterLink>
</template>
