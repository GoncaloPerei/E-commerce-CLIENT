<script setup>
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useCartsStore } from "@/store/CartsService";
import { useOrdersStore } from "@/store/OrdersService";
import { useAuthStore } from "@/store/AuthService";
import CartSummary from "@/components/CartSummary.vue";
import AuthError from "@/components/AuthError.vue";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import RadioButton from "primevue/radiobutton";

const router = useRouter();

const cartsStore = useCartsStore();
const ordersStore = useOrdersStore();
const authStore = useAuthStore();

const postOrder = async () => {
  try {
    await ordersStore.postContent();
    router.push({ path: "/checkout/confirmation" });
  } catch (error) {
    console.log(error);
  }
};

const goToProfile = () => {
  router.push({ path: "/profile" });
};

const changeOrder = () => {
  router.push({ path: "/checkout/details" });
};

const goBack = () => {
  router.go(-1);
};

onMounted(async () => {
  await cartsStore.getCart();
});

onUnmounted(async () => {
  await cartsStore.$reset();
  await ordersStore.$reset();
});
</script>

<template>
  <div class="w-auto h-auto flex gap-5 mt-20 px-5 py-6">
    <div class="w-full h-auto flex flex-col gap-5">
      <div class="bg-[#BEBEBE]/20 p-8 rounded-lg flex justify-center">
        <span class="tracking-wider"
          >Select the payment method to proceed with checkout...</span
        >
      </div>
      <div class="w-full flex flex-col gap-5">
        <span class="text-xl font-bold tracking-wider">Order Details</span>
        <div
          class="w-full h-auto bg-[#BEBEBE]/20 flex justify-between items-start px-8 py-4 rounded-lg"
        >
          <div>
            <ul>
              <li class="my-4">
                <span class="font-bold tracking-wider">First Name:</span>
                {{ ordersStore.firstName }}
              </li>
              <li class="my-4">
                <span class="font-bold tracking-wider">Last Name:</span>
                {{ ordersStore.lastName }}
              </li>
              <li class="my-4">
                <span class="font-bold tracking-wider">Address:</span>
                {{ ordersStore.address }}
              </li>
              <li class="my-4">
                <span class="font-bold tracking-wider">City:</span>
                {{ ordersStore.city }}
              </li>
              <li class="my-4">
                <span class="font-bold tracking-wider">Postal Code:</span>
                {{ ordersStore.postalCode }}
              </li>
              <li class="my-4">
                <span class="font-bold tracking-wider">Nif:</span>
                {{ ordersStore.nif }}
              </li>
            </ul>
          </div>
          <button
            @click="changeOrder()"
            class="font-bold text-[#0B6BDA] tracking-wider underline underline-offset-2 my-4"
          >
            Change Order Details
          </button>
        </div>
      </div>
      <div class="w-full flex flex-col gap-5">
        <div class="relative w-full h-auto flex justify-between">
          <span class="font-bold text-xl tracking-wider">Payment Methods</span>
          <button
            @click="goToProfile()"
            class="font-bold text-[#0B6BDA] tracking-wider underline underline-offset-2"
          >
            Add Payment Method
          </button>
        </div>
        <div
          class="w-full h-auto bg-[#BEBEBE]/20 flex items-center gap-6 p-8 rounded-lg"
        >
          <RadioButton
            v-model="ordersStore.method"
            inputId="method1"
            name="method"
            :value="0"
          />
          <b-icon-wallet-fill class="text-4xl text-[#0B6BDA]" />
          <div class="flex flex-col gap-1">
            <span class="text-lg font-bold tracking-wider"
              >Checking Account</span
            >
            <span class="tracking-wider"
              >This payment method withdraws money in the e-commerce checking
              account</span
            >
          </div>
        </div>
        <div
          v-for="card in authStore.user.cards"
          class="w-full h-auto bg-[#BEBEBE]/20 flex-col p-8 rounded-lg transition-all duration-300 ease-in-out"
        >
          <div class="w-full h-auto flex items-center gap-6">
            <RadioButton
              v-model="ordersStore.method"
              inputId="method2"
              name="method"
              :value="card.id"
            />
            <img
              class="w-10"
              :src="card.cardType.image"
              :alt="card.cardType.name"
            />
            <span class="font-bold tracking-wider">{{
              card.cardType.name
            }}</span>
            <span class="tracking">{{ card.cardNumber }}</span>
          </div>
        </div>
      </div>
      <div class="w-full flex flex-col gap-5">
        <span class="text-xl font-bold tracking-wider">Aditional Comments</span>
        <Textarea
          rows="5"
          cols="30"
          class="p-8"
          placeholder="Add a comment about the order"
          v-model="ordersStore.aditionalComments"
        />
      </div>
      <div class="w-full flex gap-5">
        <button
          @click="postOrder()"
          class="w-full border-0 bg-[#0B6BDA] rounded-lg text-white tracking-wider text-sm font-bold p-4 text-center hover:brightness-90 hover:scale-105 transition-all duration-300 ease-in-out"
        >
          Continue
        </button>
        <button
          @click="goBack()"
          class="w-full bg-white border border-[#0B6BDA] text-[#0B6BDA] rounded-lg tracking-wider text-sm font-bold p-4 text-center hover:brightness-90 hover:scale-105 transition-all duration-300 ease-in-out"
        >
          Go Back
        </button>
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
