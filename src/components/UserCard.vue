<script setup>
import { RouterLink } from "vue-router";
import { useAuthStore } from "@/store/AuthService";

const authStore = useAuthStore();
</script>

<template>
  <div
    v-if="authStore.authStatus"
    class="w-full flex gap-3.5 p-4 items-center bg-white rounded-lg"
  >
    <b-icon-person-circle class="text-[#0B6BDA] text-3xl" />
    <div class="flex flex-col gap-1">
      <span class="font-bold tracking-wider">{{ authStore.getFirstName }}</span>
      <RouterLink
        to="/profile"
        class="text-[#BEBEBE] underline underline-offset-4 text-sm"
        >See Profile...</RouterLink
      >
    </div>
  </div>
  <RouterLink
    v-else
    to="/auth/login"
    class="w-full flex gap-3.5 p-4 items-center bg-white rounded-lg"
  >
    <b-icon-person-circle class="text-[#0B6BDA] text-3xl" />
    <span class="font-bold tracking-wider">Login</span>
  </RouterLink>
</template>
