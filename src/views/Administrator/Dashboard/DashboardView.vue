<script setup>
import { onMounted, onUnmounted } from "vue";
import { useUsersStore } from "@/store/UserService";
import { useCategoriesStore } from "@/store/CategoriesService";
import { useProductsStore } from "@/store/ProductsService";
import AdminCard from "@/components/AdminCard.vue";

const usersStore = useUsersStore();
const categoriesStore = useCategoriesStore();
const productsStore = useProductsStore();

//Lifecycle Hooks
onMounted(async () => {
  try {
    await usersStore.getContent();
  } catch (error) {
    console.log(error);
  }
  try {
    await productsStore.getContent();
  } catch (error) {
    console.log(error);
  }
  try {
    await categoriesStore.getContent();
  } catch (error) {
    console.log(error);
  }
});

onUnmounted(async () => {
  await usersStore.$reset();
  await productsStore.$reset();
  await categoriesStore.$reset();
});
</script>

<template>
  <div class="relative w-screen h-screen px-5 py-6 flex flex-col">
    <div class="p-2.5">
      <span class="font-bold text-2xl tracking-wider">Dashboard</span>
    </div>
    <div class="w-full h-full flex flex-col gap-5 items-center justify-center">
      <div class="w-full flex justify-center gap-5">
        <AdminCard link="/admin/users" iconName="b-icon-people-fill">
          <template #count>{{ usersStore?.data?.meta?.total }}</template>
          <template #name> Users </template>
        </AdminCard>
        <AdminCard link="/admin/products" iconName="b-icon-box-fill">
          <template #count>{{ productsStore?.data?.meta?.total }}</template>
          <template #name> Products </template>
        </AdminCard>
      </div>
      <div class="w-full flex justify-center gap-5">
        <AdminCard link="/admin/categories" iconName="b-icon-grid-fill">
          <template #count>{{ categoriesStore?.data?.meta?.total }}</template>
          <template #name> Categories </template>
        </AdminCard>
      </div>
    </div>
  </div>
</template>
