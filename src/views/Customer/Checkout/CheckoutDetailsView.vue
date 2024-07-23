<script setup>
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useCartsStore } from "@/store/CartsService";
import { useOrdersStore } from "@/store/OrdersService";
import { useGeoApiStore } from "@/store/GeoApiService";
import CartSummary from "@/components/CartSummary.vue";
import AuthError from "@/components/AuthError.vue";
import InputText from "primevue/inputtext";
import Button from "primevue/button";

const router = useRouter();

const cartsStore = useCartsStore();
const ordersStore = useOrdersStore();
const getApiStore = useGeoApiStore();

const goBack = async () => {
  router.go(-1);
};

const capitalizeWords = async (event, operation) => {
  let input = event;

  input = input
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  ordersStore[operation] = input;
};

const testPC = async () => {
  getApiStore.postalCode = ordersStore.postalCode;
  await getApiStore.getContent();
};

const testDetails = async () => {
  try {
    await ordersStore.testDetails();
    router.push({ path: "/checkout/payments" });
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  await cartsStore.getCart();
});

onUnmounted(async () => {
  await cartsStore.$reset();
});
</script>

<template>
  <div class="w-auto h-auto flex gap-5 mt-20 px-5 py-6">
    <div class="w-full h-auto flex flex-col gap-5">
      <div class="bg-[#BEBEBE]/20 p-8 rounded-lg flex justify-center">
        <span class="tracking-wider"
          >Enter the following details about the order to proceed with
          checkout...</span
        >
      </div>
      <div
        class="w-full h-auto bg-[#BEBEBE]/20 p-8 rounded-lg flex flex-col gap-5"
      >
        <div class="w-full h-auto flex gap-2.5">
          <div class="w-full flex flex-col gap-2">
            <label for="image" class="tracking-wider w-auto text-black"
              >First Name
              <span class="font-bold text-lg text-red-500">*</span></label
            >
            <InputText
              id="image"
              class="border border-[#BEBEBE] px-3.5 py-4"
              autocomplete="off"
              placeholder="First Name"
              v-model="ordersStore.firstName"
              @update:modelValue="capitalizeWords($event, 'firstName')"
            />
            <AuthError v-if="ordersStore?.errors?.firstName">{{
              ordersStore?.errors?.firstName.toString()
            }}</AuthError>
          </div>
          <div class="w-full flex flex-col gap-2">
            <label for="image" class="tracking-wider w-auto text-black"
              >Last Name
              <span class="font-bold text-lg text-red-500">*</span></label
            >
            <InputText
              id="image"
              class="border border-[#BEBEBE] px-3.5 py-4"
              autocomplete="off"
              placeholder="Last Name"
              v-model="ordersStore.lastName"
              @update:modelValue="capitalizeWords($event, 'lastName')"
            />
            <AuthError v-if="ordersStore?.errors?.lastName">{{
              ordersStore?.errors?.lastName.toString()
            }}</AuthError>
          </div>
        </div>
        <div class="w-full h-auto flex gap-2.5">
          <div class="w-full flex flex-col gap-2">
            <label for="address" class="tracking-wider w-auto text-black"
              >Address
              <span class="font-bold text-lg text-red-500">*</span></label
            >
            <InputText
              id="address"
              class="border border-[#BEBEBE] px-3.5 py-4"
              autocomplete="off"
              placeholder="Address"
              v-model="ordersStore.address"
              @update:modelValue="capitalizeWords($event, 'address')"
            />
            <AuthError v-if="ordersStore?.errors?.address">{{
              ordersStore?.errors?.address.toString()
            }}</AuthError>
          </div>
        </div>
        <div class="w-full h-auto flex gap-2.5">
          <div class="w-full flex flex-col gap-2">
            <label for="postalCode" class="tracking-wider w-auto text-black"
              >Postal Code
              <span class="font-bold text-lg text-red-500">*</span></label
            >
            <InputText
              id="postalCode"
              class="border border-[#BEBEBE] px-3.5 py-4"
              autocomplete="off"
              placeholder="Postal Code"
              v-model="ordersStore.postalCode"
              maxlength="8"
              masked="true"
              v-mask="'####-###'"
            />
            <AuthError v-if="ordersStore?.errors?.postalCode">{{
              ordersStore?.errors?.postalCode.toString()
            }}</AuthError>
          </div>
          <div class="w-full flex flex-col gap-2">
            <label for="city" class="tracking-wider w-auto text-black"
              >City <span class="font-bold text-lg text-red-500">*</span></label
            >
            <InputText
              id="city"
              class="border border-[#BEBEBE] px-3.5 py-4"
              autocomplete="off"
              placeholder="City"
              v-model="ordersStore.city"
              @update:modelValue="capitalizeWords($event, 'city')"
            />
            <AuthError v-if="ordersStore?.errors?.city">{{
              ordersStore?.errors?.city.toString()
            }}</AuthError>
          </div>
        </div>
        <div class="w-full h-auto flex gap-2.5">
          <div class="w-full flex flex-col gap-2">
            <label for="nif" class="tracking-wider w-auto text-black"
              >Nif</label
            >
            <InputText
              id="nif"
              class="border border-[#BEBEBE] px-3.5 py-4"
              autocomplete="off"
              placeholder="Nif"
              maxlength="8"
              v-model="ordersStore.nif"
              masked="true"
              v-mask="'#########'"
            />
            <AuthError v-if="ordersStore?.errors?.nif">{{
              ordersStore?.errors?.nif.toString()
            }}</AuthError>
          </div>
        </div>
      </div>
      <div class="w-full flex gap-5">
        <Button
          @click="testDetails()"
          class="w-full border-0 bg-[#0B6BDA] rounded-lg text-white tracking-wider text-sm font-bold p-4 text-center hover:brightness-90 hover:scale-105 transition-all duration-300 ease-in-out"
        >
          Continue
        </Button>
        <Button
          @click="goBack()"
          class="w-full bg-white border border-[#0B6BDA] text-[#0B6BDA] rounded-lg tracking-wider text-sm font-bold p-4 text-center hover:brightness-90 hover:scale-105 transition-all duration-300 ease-in-out"
        >
          Go Back
        </Button>
      </div>
    </div>
    <CartSummary :cartPrice="cartsStore?.cart?.cartPrice">
      <template #cartItems>
        <div
          v-if="cartsStore?.cart?.cartItem?.length > 0"
          v-for="item in cartsStore?.cart?.cartItem"
          class="w-full gap-10 flex justify-between items-center overflow-hidden"
        >
          <span class="text-wrap text-sm max-w-48 truncate overflow-hidden"
            ><span class="font-bold">{{ item?.quantity }}x</span>
            {{ item?.product?.title }}</span
          >
          <span class="text-nowrap font-bold">{{ item?.productTotal }} €</span>
        </div>
        <div v-else>
          <span>Cart has no products</span>
        </div>
      </template>
    </CartSummary>
  </div>
</template>
