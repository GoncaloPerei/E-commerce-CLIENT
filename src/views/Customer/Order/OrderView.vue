<script setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useOrdersStore } from "@/store/OrdersService";
import StatusCard from "@/components/StatusCard.vue";
import { onUnmounted } from "vue";

const route = useRoute();
const router = useRouter();

const ordersStore = useOrdersStore();

const goBack = () => {
  router.push({ path: `/order` });
};

onMounted(async () => {
  ordersStore.id = route.params.id;
  await ordersStore.getOrder();
});

onUnmounted(async () => {
  await ordersStore.$reset();
});
</script>

<template>
  <div class="w-full h-auto flex flex-col gap-5 mx-5 my-6 overflow-y-auto">
    <div class="w-full h-auto flex items-center gap-2.5">
      <span class="text-2xl tracking-wider font-bold"
        >Order
        <span class="text-[#0B6BDA]"
          >Nº{{ ordersStore?.getOrders?.id }}</span
        ></span
      >
      <StatusCard :order="ordersStore?.getOrders" />
    </div>
    <div class="w-full h-full flex flex-col gap-5">
      <div class="w-full h-auto bg-[#BEBEBE]/20 p-8 rounded-lg">
        <button
          @click="goBack()"
          class="font-bold tracking-wider flex gap-2.5 items-center"
        >
          <b-icon-arrow-left class="text-lg" />
          <span>Back to orders</span>
        </button>
      </div>
      <div
        class="w-full h-auto bg-[#BEBEBE]/20 p-8 rounded-lg flex flex-col gap-5"
      >
        <span class="font-bold tracking-wider"
          >Date:
          <span class="font-normal">{{
            ordersStore?.getOrders?.createdAt
          }}</span></span
        >
        <table class="relative w-fit min-w-full h-auto tracking-wider">
          <thead class="relative text-base">
            <tr class="">
              <th align="left" class="p-2.5" data-priority="1">Product</th>
              <th align="left" class="p-2.5" data-priority="1"></th>
              <th align="center" class="p-2.5" data-priority="2">Quantity</th>
              <th align="center" class="p-2.5" data-priority="3">Price</th>
            </tr>
          </thead>
          <tbody class="relative overflow-hidden">
            <tr
              v-for="item in ordersStore?.getOrders?.cart?.cartItem"
              :key="item.id"
              class="border-t border-[#BEBEBE] overflow-hidden"
            >
              <td class="p-2.5 overflow-hidden" align="left">
                <img
                  class="w-20 rounded-lg p-2 bg-white"
                  :src="item.product.image"
                  :alt="item.product.title"
                />
              </td>
              <td class="p-2.5">{{ item.product.title }}</td>
              <td align="center" class="p-2.5">{{ item.quantity }} x</td>
              <td align="center" class="p-2.5 font-bold text-[#0B6BDA]">
                {{ item.productTotal }} €
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="w-full p-8 bg-[#BEBEBE]/20 rounded-lg flex flex-col gap-2.5">
        <span class="text-lg font-bold tracking-wider">Total</span>
        <div class="w-full flex justify-between">
          <span class="tracking-wider">Total:</span>
          <span class="tracking-wider font-bold text-[#0B6BDA]">
            {{ ordersStore?.getOrders?.cart?.cartPrice }} €
          </span>
        </div>
      </div>
      <div class="w-full p-8 bg-[#BEBEBE]/20 rounded-lg flex flex-col gap-2.5">
        <span class="text-lg font-bold tracking-wider">Order Details</span>
        <span class="leading-loose tracking-wider">
          {{ ordersStore?.getOrders?.details?.firstName }}
          {{ ordersStore?.getOrders?.details?.lastName }}
          <br />
          {{ ordersStore?.getOrders?.details?.address }}
          <br />
          {{ ordersStore?.getOrders?.details?.city }}
          <br />
          {{ ordersStore?.getOrders?.details?.postalCode }}
          <br />
          {{ ordersStore?.getOrders?.details?.nif }}
        </span>
      </div>
      <div class="w-full p-8 bg-[#BEBEBE]/20 rounded-lg flex flex-col gap-2.5">
        <span class="text-lg font-bold tracking-wider">Payment Details</span>
        <div class="flex flex-col gap-2.5">
          <span class="tracking-wider">
            <span class="font-bold tracking-wider">Method:</span>
            {{ ordersStore?.getOrders?.payment?.type?.name }}
          </span>
          <span class="tracking-wider">
            <span class="font-bold tracking-wider">Notes:</span>
            {{ ordersStore?.getOrders?.payment?.notes }}
          </span>
        </div>
      </div>
      <div class="w-full p-8 bg-[#BEBEBE]/20 rounded-lg flex flex-col gap-2.5">
        <span class="text-lg font-bold tracking-wider">Aditional Comments</span>
        <span v-if="ordersStore?.getOrders?.aditionalComments">{{ ordersStore?.getOrders?.aditionalComments }}</span>
        <span v-else>Nothing to see here...</span>
      </div>
    </div>
  </div>
</template>
