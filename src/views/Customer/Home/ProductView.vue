<script setup>
import { onMounted, onUpdated, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProductsStore } from "@/store/ProductsService";
import { useCartsStore } from "@/store/CartsService";
import { useAuthStore } from "@/store/AuthService";
import InputText from "primevue/inputtext";

const route = useRoute();
const router = useRouter();

const productsStore = useProductsStore();
const cartsStore = useCartsStore();
const authStore = useAuthStore();

const getProduct = () => {
  try {
    productsStore.id = route.params.productid;
    productsStore.getProduct();
  } catch (error) {
    return error;
  }
};

const addProduct = async (id) => {
  if (!authStore.status) {
    alert("Not logged in");
    router.push({ path: "/auth/login" });
    return;
  }
  try {
    cartsStore.id = id;
    await cartsStore.addProduct();
    alert("Product added to cart successfully!");
    await cartsStore.clearFields();
  } catch (error) {
    return error;
  }
};

onMounted(async () => {
  try {
    await getProduct();
  } catch (error) {
    console.log(error);
  }
});

onUpdated(async () => {
  if (productsStore.id !== route.params.productid) {
    try {
      await getProduct();
    } catch (error) {
      console.log(error);
    }
  }
});

onUnmounted(async () => {
  await productsStore.$reset();
});
</script>

<template>
  <div
    class="w-auto h-full max-w-[400px] px-5 py-6 flex flex-col gap-5 items-center border-l border-[#BEBEBE] transition-all duration-500"
  >
    <div class="w-full h-full overflow-y-auto flex flex-col gap-5 items-center">
      <img
        :src="productsStore?.product?.image"
        :alt="productsStore?.product?.title"
        class="max-w-[300px]"
        decoding="async"
        loading="lazy"
      />
      <hr class="w-full h-px border-[#BEBEBE]" />
      <div class="w-full h-auto flex flex-col gap-5">
        <div>
          <span class="font-bold tracking-wider">{{
            productsStore?.product?.title
          }}</span>
        </div>
        <div class="flex justify-between items-end">
          <span
            class="text-xs tracking-wider text-[#BEBEBE] border border-[#BEBEBE] px-2.5 py-3 rounded-lg"
          >
            {{ productsStore?.product?.category?.name }}
          </span>
          <span class="font-extrabold text-xl text-[#0B6BDA] tracking-wider"
            >{{ productsStore?.product?.price }} €</span
          >
        </div>
      </div>
      <hr class="w-full h-px border-[#BEBEBE]" />
      <span class="text-xs tracking-wider leading-relaxed">{{
        productsStore?.product?.description
      }}</span>
      <hr class="w-full h-px border-[#BEBEBE]" />
    </div>
    <div class="w-full flex gap-2.5 px-2.5">
      <InputText
        id="quantity"
        class="max-w-24 border border-[#BEBEBE] px-3.5 py-4"
        autocomplete="off"
        placeholder="0"
        type="number"
        v-model="cartsStore.quantity"
      />
      <button
        v-if="productsStore?.product?.stock > 0"
        @click="addProduct(productsStore?.product?.id)"
        class="w-full bg-[#0B6BDA] rounded-lg text-white tracking-wider text-sm font-bold p-4 hover:brightness-90 hover:scale-105 transition-all duration-300"
      >
        Add to Cart
      </button>
      <button
        v-else
        disabled="true"
        class="w-full bg-[#0B6BDA] rounded-lg text-white tracking-wider text-sm font-bold p-4 disabled:brightness-90"
      >
        Not Available
      </button>
    </div>
  </div>
</template>
