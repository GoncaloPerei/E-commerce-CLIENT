<script setup>
import { onMounted, onUnmounted } from "vue";
import { useCartsStore } from "@/store/CartsService";
import CartSummary from "@/components/CartSummary.vue";
import InputText from "primevue/inputtext";
import checkIfNull from "@/resources/checkIfNull";
import StockCard from "@/components/StockCard.vue";

const cartsStore = useCartsStore();

const removeProduct = async (id) => {
  try {
    cartsStore.id = id;
    await cartsStore.removeProduct();
    alert(cartsStore.response.message);
    await cartsStore.clearFields();
    await cartsStore.getCart();
  } catch (error) {
    console.log(error);
  }
};

const cleanCart = async () => {
  try {
    await cartsStore.cleanCart();
    alert(cartsStore.response.message);
    await cartsStore.clearFields();
    await cartsStore.getCart();
  } catch (error) {
    console.log(error);
  }
};

const updateQuantity = async (id) => {
  try {
    cartsStore.id = id;
    await cartsStore.updateCart();
    alert(cartsStore.response.message);
    await cartsStore.clearFields();
    await cartsStore.getCart();
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
  <div class="w-full h-full flex flex-col gap-5 px-5 py-6">
    <div class="w-full h-auto">
      <span class="text-2xl tracking-wider font-bold">Shooping Cart</span><br />
      <span
        >TOTAL ({{ cartsStore?.cart?.cartItemCount }} Items)
        {{ cartsStore?.cart?.cartPrice }} €</span
      >
    </div>
    <div class="w-full h-auto flex gap-5">
      <div class="w-full h-auto flex flex-col gap-5">
        <div
          class="w-full max-w-full h-auto overflow-hidden bg-[#BEBEBE]/20 p-8 rounded-lg"
        >
          <div class="overflow-x-scroll">
            <table class="relative w-fit min-w-full tracking-wider">
              <thead class="relative text-base">
                <tr class="border-b border-black">
                  <th
                    align="left"
                    class="w-fit p-4 text-nowrap"
                    data-priority="1"
                  >
                    Product
                  </th>
                  <th
                    align="left"
                    class="w-fit p-4 text-nowrap"
                    data-priority="2"
                  >
                    Description
                  </th>
                  <th
                    align="left"
                    class="w-fit p-4 text-nowrap"
                    data-priority="3"
                  >
                    Price
                  </th>
                  <th
                    align="left"
                    class="w-fit p-4 text-nowrap"
                    data-priority="4"
                  >
                    Quantity
                  </th>
                  <th
                    align="left"
                    class="w-fit p-4 text-nowrap"
                    data-priority="5"
                  >
                    Total
                  </th>
                  <th
                    align="left"
                    class="w-fit p-4 text-nowrap"
                    data-priority="6"
                  ></th>
                </tr>
              </thead>
              <tbody class="relative overflow-hidden">
                <template v-if="cartsStore?.cart?.cartItemCount > 0">
                  <tr
                    v-for="data in cartsStore?.cart?.cartItem"
                    :key="data.id"
                    class="border-t border-[#BEBEBE] overflow-hidden"
                  >
                    <td
                      class="w-fit px-5 py-10 max-w-xs truncate tracking-wider"
                    >
                      <img
                        :src="data?.product?.image"
                        :alt="data?.product?.title"
                        class="rounded-lg"
                        decoding="async"
                        loading="lazy"
                      />
                    </td>
                    <td
                      class="w-full px-5 py-10 max-w-xs truncate tracking-wider"
                    >
                      <RouterLink
                        :to="
                          '/category/' +
                          data?.product?.category?.id +
                          '/product/' +
                          data?.product?.id
                        "
                        class="font-bold hover:text-[#0B6BDA] transition-all duration-300"
                        >{{ checkIfNull(data?.product?.title) }}</RouterLink
                      ><br />
                      <StockCard :stock="data?.product?.stock" />
                    </td>
                    <td
                      class="w-full px-5 py-10 max-w-xs truncate tracking-wider font-bold text-lg"
                    >
                      {{ checkIfNull(data?.product?.price) }} €
                    </td>
                    <td
                      class="w-full py-10 max-w-xs truncate tracking-wider overflow-hidden"
                    >
                      <InputText
                        id="image"
                        class="max-w-20 border border-[#BEBEBE] px-3 py-3 text-sm overflow-hidden"
                        type="number"
                        autocomplete="off"
                        :value="data.quantity"
                        @update:modelValue="cartsStore.quantity = $event"
                        @blur="updateQuantity(data.id)"
                      />
                    </td>
                    <td
                      class="w-full px-5 py-10 max-w-xs truncate tracking-wider font-bold text-lg text-[#0B6BDA]"
                    >
                      {{ checkIfNull(data?.productTotal) }} €
                    </td>
                    <td
                      class="w-full px-5 py-10 max-w-xs truncate tracking-wider font-bold text-lg"
                    >
                      <button @click="removeProduct(data?.id)">
                        <b-icon-x-lg />
                      </button>
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <tr>
                    <td colspan="6">
                      <div
                        class="relative w-full min-h-52 flex justify-center items-center px-3.5 py-2 tracking-wider"
                      >
                        <span>Nothing to show here...</span>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
        <div class="w-full bg-[#BEBEBE]/20 p-8 flex justify-between rounded-lg">
          <RouterLink
            :to="'/category/1'"
            class="flex gap-2.5 items-center hover:text-[#0B6BDA] transition-all duration-300 ease-in-out"
          >
            <b-icon-arrow-left />
            <span class="font-bold tracking-wider">Continue shooping</span>
          </RouterLink>
          <button
            @click="cleanCart()"
            class="flex gap-2.5 items-center hover:text-[#0B6BDA] transition-all duration-300 ease-in-out"
          >
            <b-icon-trash3-fill />
            <span class="font-bold tracking-wider">Clean cart</span>
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
            <span class="text-nowrap font-bold"
              >{{ item?.productTotal }} €</span
            >
          </div>
          <div v-else>
            <span>Cart has no products</span>
          </div>
        </template>
        <template #button>
          <RouterLink
            to="/checkout/details"
            class="bg-[#0B6BDA] rounded-lg text-white tracking-wider text-sm font-bold p-4 text-center hover:brightness-90 hover:scale-105 transition-all duration-300 ease-in-out"
          >
            Payment
          </RouterLink>
        </template>
      </CartSummary>
    </div>
  </div>
</template>
