<script setup>
import { useAuthStore } from "@/store/AuthService";
import Navbar from "@/components/Navbar.vue";
import NavCard from "@/components/NavCard.vue";
import UserCard from "@/components/UserCard.vue";
import Logo from "@/components/Logo.vue";

const authStore = useAuthStore();
</script>

<template>
  <div class="relative flex">
    <Navbar>
      <template #Logo>
        <Logo link="/" />
      </template>
      <template #NavCards>
        <NavCard link="/" iconName="b-icon-house-fill">Dashboard</NavCard>
        <NavCard link="/cart" iconName="b-icon-cart3" v-if="authStore?.authUser"
          >Shooping Cart</NavCard
        >
        <NavCard
          link="/order"
          iconName="b-icon-box-seam-fill"
          v-if="authStore?.authUser"
          >Orders</NavCard
        >
        <NavCard
          v-if="authStore.authStatus && authStore?.user?.role?.id === 1"
          link="/admin"
          iconName="b-icon-person-fill-lock"
          >Administrator</NavCard
        >
      </template>
      <template #UserCard>
        <UserCard />
      </template>
    </Navbar>
    <RouterView />
  </div>
</template>
