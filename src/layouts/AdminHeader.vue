<script setup>
import Navbar from "@/components/Navbar.vue";
import NavCard from "@/components/NavCard.vue";
import UserCard from "@/components/UserCard.vue";
import Logo from "@/components/Logo.vue";
</script>

<template>
  <div class="relative flex">
    <Navbar>
      <template #Logo>
        <Logo link="/admin" />
      </template>
      <template #NavCards>
        <NavCard link="/admin" iconName="b-icon-house-fill">Dashboard</NavCard>
        <NavCard link="/admin/users" iconName="b-icon-people-fill"
          >Users</NavCard
        >
        <NavCard link="/admin/products" iconName="b-icon-box-fill"
          >Products</NavCard
        >
        <NavCard link="/admin/categories" iconName="b-icon-grid-fill"
          >Categories</NavCard
        >
        <NavCard link="/" iconName="b-icon-person-fill-lock">Client</NavCard>
      </template>
      <template #UserCard>
        <UserCard />
      </template>
    </Navbar>
    <RouterView />
  </div>
</template>
