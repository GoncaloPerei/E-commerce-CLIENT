<script setup>
import Logo from "@/components/Logo.vue";
</script>

<template>
  <div
    class="fixed top-0 w-full h-auto flex items-center justify-center bg-[#BEBEBE]/20 py-6"
  >
    <Logo link="/" />
  </div>
  <RouterView />
</template>
