<script setup>
import { onMounted, onUnmounted, onUpdated } from "vue";
import { useRoute } from "vue-router";
import { useProductsStore } from "@/store/ProductsService";
import { useCrudOptionsStore } from "@/store/useCrudOptions";
import ProductCard from "@/components/ProductCard.vue";
import Paginator from "primevue/paginator";

const route = useRoute();

//Initialize Stores
const productsStore = useProductsStore();
const crudOptionsStore = useCrudOptionsStore();

const handleChange = async () => {
  await productsStore.getCustomerContent();
};

//Lifecycle Hooks
onMounted(async () => {
  productsStore.params.paginate = 10;
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
      await crudOptionsStore.$reset();
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
    class="relative w-full h-auto px-5 py-6 flex flex-col justify-between overflow-y-scroll gap-5"
  >
    <div class="relative w-full h-full flex justify-center overflow-y-auto">
      <div class="w-full flex flex-wrap justify-center gap-5">
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
    </div>
    <div
      class="relative w-auto bg-[#BEBEBE]/20 flex justify-center items-center p-8 mx-5 rounded-lg"
    >
      <Paginator
        v-model:first="crudOptionsStore.page"
        @update:first="handleChange()"
        :rows="1"
        :totalRecords="productsStore?.data?.meta?.last_page"
        template="PrevPageLink CurrentPageReport NextPageLink"
        class="absolute m-auto left-0 right-0 font-bold"
      />
    </div>
  </div>
  <RouterView />
</template>
