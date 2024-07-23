<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/store/AuthService";
import { useOrdersStore } from "@/store/OrdersService";
import Paginator from "primevue/paginator";
import StatusCard from "@/components/StatusCard.vue";

const router = useRouter();

const authStore = useAuthStore();
const ordersStore = useOrdersStore();

const changeOrder = (id) => {
  try {
    router.push({ path: `order/${id}` });
  } catch (error) {
    console.log(error);
  }
};

const handleChange = async () => {
  await ordersStore.getContent();
};

onMounted(async () => {
  ordersStore.params.paginate = 5;
  await ordersStore.getContent();
});

onUnmounted(async () => {
  await ordersStore.$reset();
});
</script>

<template>
  <div class="w-full h-screen flex flex-col gap-5 px-5 py-6">
    <div class="w-full h-auto">
      <span class="text-2xl tracking-wider font-bold">Orders</span><br />
      <span
        >Performed by
        <span class="tracking-wider font-bold text-[#0B6BDA]">{{
          authStore.user.fullName
        }}</span></span
      >
    </div>
    <div
      v-if="ordersStore?.getOrders?.length > 0"
      class="w-full h-full overflow-y-auto overflow-x-hidden flex flex-col gap-5"
    >
      <div class="w-auto h-auto p-8 mx-5 bg-[#BEBEBE]/20 rounded-lg">
        <span class="text-black tracking-wider"
          >Showing {{ ordersStore?.data?.meta?.from ?? "0" }} -
          {{ ordersStore?.data?.meta?.to ?? "0" }} of
          {{ ordersStore?.data?.meta?.total ?? "0" }} payments</span
        >
      </div>
      <div
        v-for="order in ordersStore.getOrders"
        class="w-auto max-w-full h-auto p-8 mx-5 bg-[#BEBEBE]/20 rounded-lg flex flex-col gap-5"
      >
        <div class="w-full flex flex-col gap-5">
          <div class="w-full flex gap-2.5 items-center justify-between">
            <div class="flex gap-2.5 items-center">
              <span class="font-bold text-xl tracking-wider"
                >Order <span class="text-[#0B6BDA]">Nº {{ order.id }}</span>
              </span>
              <StatusCard :order="order" />
            </div>
            <button
              @click="changeOrder(order.id)"
              class="font-bold text-[#0B6BDA] tracking-wider underline underline-offset-2 my-4"
            >
              See Order Details +
            </button>
          </div>
          <div class="w-full flex items-center justify-between">
            <div class="flex flex-col gap-1">
              <span class="font-bold"
                >Created at:
                <span class="font-normal">{{ order.createdAt }}</span></span
              >
              <span class="font-bold"
                >Total:
                <span class="text-[#0B6BDA]"
                  >{{ order.cart.cartPrice }} €</span
                ></span
              >
            </div>
          </div>
        </div>
      </div>
      <div
        class="relative w-auto bg-[#BEBEBE]/20 flex justify-center items-center p-8 mx-5 rounded-lg"
      >
        <Paginator
          v-model:first="ordersStore.currentPage"
          @update:first="handleChange()"
          :rows="1"
          :totalRecords="ordersStore?.data?.meta?.last_page"
          template="PrevPageLink CurrentPageReport NextPageLink"
          class="absolute m-auto left-0 right-0 font-bold"
        />
      </div>
    </div>
    <div v-else class="w-full h-full flex items-center justify-center">
      <span class="text-xl tracking-wider"
        >You don't have any orders yet...</span
      >
    </div>
  </div>
</template>
