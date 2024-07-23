<script setup>
import { onMounted, onUnmounted, onUpdated } from "vue";
import { useRoute } from "vue-router";
import { useProductsStore } from "@/store/ProductsService";
import ProductCard from "@/components/ProductCard.vue";

const route = useRoute();

//Initialize Stores
const productsStore = useProductsStore();

//Lifecycle Hooks
onMounted(async () => {
  productsStore.params.filter.product_status_id = 1;
  productsStore.params.filter.product_category_id = route.params.id;
  try {
    await productsStore.getCustomerContent();
  } catch (error) {
    console.log(error);
  }
});

onUpdated(async () => {
  if (productsStore.params.filter.product_category_id !== route.params.id) {
    productsStore.params.filter.product_category_id = route.params.id;
    try {
      await productsStore.clearFields();
      await productsStore.getCustomerContent();
    } catch (error) {
      console.log(error);
    }
  }
});

onUnmounted(async () => {
  try {
    await productsStore.$reset();
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <div
    class="w-full h-screen px-5 py-6 flex flex-wrap justify-center overflow-y-scroll gap-5"
  >
    <ProductCard
      v-for="product in productsStore?.data?.data"
      class="hover:scale-105 transition-all duration-300"
      :title="product?.title"
      :price="product?.price"
      :image="product?.image"
      :stock="product?.stock"
      :link="'/category/' + route.params.id + '/product/' + product?.id"
    />
    
  </div>
  <RouterView />
</template>
