<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useCategoriesStore } from "@/store/CategoriesService";
import { useProductsStore } from "@/store/ProductsService";
import InputText from "primevue/inputtext";
import Select from "primevue/select";

const categoriesStore = useCategoriesStore();
const productsStore = useProductsStore();

const handleSort = async () => {
  productsStore.params.sort = `${productsStore.sort.id}`;
  await productsStore.getCustomerContent();
};

const removeSort = async () => {
  productsStore.params.sort = null;
  productsStore.sort = null;
  await productsStore.getCustomerContent();
};

const handleRange = () => {
  if (productsStore.minPrice && productsStore.maxPrice) {
    productsStore.$patch((state) => {
      state.params.filter.price_range = `${productsStore.minPrice},${productsStore.maxPrice}`;
    });
  } else if (productsStore.minPrice) {
    productsStore.$patch((state) => {
      state.params.filter.price_range = `${productsStore.minPrice},null`;
    });
  } else if (productsStore.maxPrice) {
    productsStore.$patch((state) => {
      state.params.filter.price_range = `null,${productsStore.maxPrice}`;
    });
  } else {
    productsStore.$patch((state) => {
      state.params.filter.price_range = null;
    });
  }
  productsStore.getCustomerContent();
};

onMounted(async () => {
  categoriesStore.params.filter.product_status_id = 1;
  await categoriesStore.getCustomerContent();
});

onUnmounted(async () => {
  await categoriesStore.$reset();
  await productsStore.$reset();
});
</script>

<template>
  <div class="w-full h-screen flex overflow-hidden">
    <div
      class="w-full max-w-[350px] h-screen px-5 py-6 flex flex-col gap-5 overflow-hidden border-r border-[#BEBEBE]"
    >
      <InputText
        class="relative border border-[#BEBEBE] rounded-lg px-3.5 py-4 tracking-wider w-full text-sm"
        id="search"
        autocomplete="off"
        placeholder="Search a product"
        v-model="productsStore.params.filter.title"
        @change="productsStore.getCustomerContent()"
      />
      <div class="flex flex-col gap-2.5">
        <span class="font-bold tracking-wider">Categories</span>
        <div class="flex flex-col gap-2.5 items-start py-2.5">
          <RouterLink
            class="px-3.5 py-2.5 flex gap-3.5 items-center tracking-wider"
            v-for="category in categoriesStore?.data?.data"
            :to="'/category/' + category?.id"
          >
            <img
              :src="category?.image"
              class="w-10"
              decoding="async"
              loading="lazy"
            />
            {{ category?.name }}
          </RouterLink>
        </div>
      </div>
      <hr class="border-[#BEBEBE]" />
      <div class="flex flex-col gap-2.5">
        <div class="w-full flex justify-between items-center">
          <span class="font-bold tracking-wider">Order By</span>
          <button v-if="productsStore.sort" @click="removeSort()">
            <b-icon-x class="text-xl" />
          </button>
        </div>
        <div class="py-3.5">
          <Select
            id="category"
            v-model="productsStore.sort"
            :options="productsStore.sortByOptions"
            @update:modelValue="handleSort()"
            optionLabel="name"
            class="w-full border border-[#BEBEBE] p-2 text-sm text-[#0B6BDA]"
            placeholder="Order By"
          />
        </div>
      </div>
      <hr class="border-[#BEBEBE]" />
      <div class="flex flex-col gap-2.5">
        <span class="font-bold tracking-wider">Filter By</span>
        <div class="py-3.5 flex flex-col">
          <div class="w-auto flex gap-3.5 justify-between items-center">
            <InputText
              class="relative border border-[#BEBEBE] rounded-lg px-3.5 py-4 tracking-wider w-full text-sm"
              id="search"
              type="number"
              autocomplete="off"
              placeholder="0€"
              v-model="productsStore.minPrice"
            />
            <span class="text-[#BEBEBE] text-sm">to...</span>
            <InputText
              class="relative border border-[#BEBEBE] rounded-lg px-3.5 py-4 tracking-wider w-full text-sm"
              id="search"
              type="number"
              autocomplete="off"
              placeholder="0€"
              v-model="productsStore.maxPrice"
              @change="handleRange()"
            />
          </div>
        </div>
      </div>
    </div>
    <RouterView />
  </div>
</template>
